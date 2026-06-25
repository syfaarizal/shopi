import uuid

from fastapi import APIRouter, Depends, HTTPException # type: ignore[import]

from app.database import (
    products_collection,
    users_collection,
    orders_collection,
)
from app.auth import require_admin
from app.models import ProductCreate, OrderStatusUpdate

router = APIRouter(prefix="/api/admin", tags=["admin"])


def serialize_product(p: dict) -> dict:
    p["id"] = p["_id"]
    p.pop("_id", None)
    return p


def serialize_user(u: dict) -> dict:
    u["id"] = u["_id"]
    u.pop("_id", None)
    u.pop("password", None)
    return u


def serialize_order(o: dict) -> dict:
    o["id"] = o.pop("_id")
    return o


# ── Dashboard stats ──────────────────────────────────────────────────────────

@router.get("/stats")
async def get_stats(_: dict = Depends(require_admin)):
    total_products = await products_collection.count_documents({})
    total_users = await users_collection.count_documents({})
    total_orders = await orders_collection.count_documents({})

    pipeline = [{"$group": {"_id": None, "revenue": {"$sum": "$total"}}}]
    result = await orders_collection.aggregate(pipeline).to_list(1)
    total_revenue = result[0]["revenue"] if result else 0

    # Recent 5 orders
    recent_orders = await orders_collection.find().sort("created_at", -1).limit(5).to_list(5)

    return {
        "total_products": total_products,
        "total_users": total_users,
        "total_orders": total_orders,
        "total_revenue": total_revenue,
        "recent_orders": [serialize_order(o) for o in recent_orders],
    }


# ── Product CRUD ─────────────────────────────────────────────────────────────

@router.get("/products")
async def list_products(_: dict = Depends(require_admin)):
    items = await products_collection.find().to_list(500)
    return {"items": [serialize_product(p) for p in items]}


@router.post("/products")
async def create_product(payload: ProductCreate, _: dict = Depends(require_admin)):
    product_id = str(uuid.uuid4())
    slug = "-".join(payload.name.lower().split())
    doc = {
        "_id": product_id,
        "slug": slug,
        "rating": 0,
        "review_count": 0,
        "sold": 0,
        **payload.dict(),
    }
    await products_collection.insert_one(doc)
    return serialize_product(doc)


@router.put("/products/{product_id}")
async def update_product(
    product_id: str, payload: dict, _: dict = Depends(require_admin)
):
    payload.pop("id", None)
    payload.pop("_id", None)
    result = await products_collection.update_one(
        {"_id": product_id}, {"$set": payload}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Product not found")
    updated = await products_collection.find_one({"_id": product_id})
    return serialize_product(updated)


@router.delete("/products/{product_id}")
async def delete_product(product_id: str, _: dict = Depends(require_admin)):
    result = await products_collection.delete_one({"_id": product_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Product not found")
    return {"deleted": product_id}


# ── Order management ─────────────────────────────────────────────────────────

@router.get("/orders")
async def list_orders(_: dict = Depends(require_admin)):
    orders = await orders_collection.find().sort("created_at", -1).to_list(500)
    return {"items": [serialize_order(o) for o in orders]}


@router.patch("/orders/{order_id}/status")
async def update_order_status(
    order_id: str, payload: OrderStatusUpdate, _: dict = Depends(require_admin)
):
    valid = {"pending", "paid", "shipped", "delivered", "cancelled"}
    if payload.status not in valid:
        raise HTTPException(status_code=400, detail=f"Status must be one of {valid}")
    result = await orders_collection.update_one(
        {"_id": order_id}, {"$set": {"status": payload.status}}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Order not found")
    return {"id": order_id, "status": payload.status}


# ── User management ──────────────────────────────────────────────────────────

@router.get("/users")
async def list_users(_: dict = Depends(require_admin)):
    users = await users_collection.find().to_list(500)
    return {"items": [serialize_user(u) for u in users]}


@router.patch("/users/{user_id}/role")
async def update_user_role(
    user_id: str, payload: dict, _: dict = Depends(require_admin)
):
    role = payload.get("role")
    if role not in ("user", "admin"):
        raise HTTPException(status_code=400, detail="Role must be 'user' or 'admin'")
    result = await users_collection.update_one({"_id": user_id}, {"$set": {"role": role}})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
    return {"id": user_id, "role": role}

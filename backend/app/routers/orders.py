import random
import uuid
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException  # type: ignore[import]

from app.database import orders_collection, cart_collection
from app.auth import get_current_user
from app.models import OrderCreate

router = APIRouter(prefix="/api/orders", tags=["orders"])

SHIPPING_COSTS = {"regular": 0, "express": 15000}


def serialize_order(o: dict) -> dict:
    o["id"] = o.pop("_id")
    return o


@router.get("")
async def list_orders(current_user: dict = Depends(get_current_user)):
    cursor = orders_collection.find({"user_id": current_user["_id"]}).sort("created_at", -1)
    orders = await cursor.to_list(200)
    return {"items": [serialize_order(o) for o in orders]}


@router.get("/{order_id}")
async def get_order(order_id: str, current_user: dict = Depends(get_current_user)):
    order = await orders_collection.find_one({"_id": order_id, "user_id": current_user["_id"]})
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return serialize_order(order)


@router.post("")
async def create_order(payload: OrderCreate, current_user: dict = Depends(get_current_user)):
    subtotal = sum(item.price * item.quantity for item in payload.items)
    shipping_cost = SHIPPING_COSTS.get(payload.shipping_method, 0)
    total = subtotal + shipping_cost

    order_id = str(uuid.uuid4())
    order_number = f"INV/{datetime.utcnow().strftime('%Y/%m/%d')}/{random.randint(10000, 99999)}"

    order_doc = {
        "_id": order_id,
        "order_number": order_number,
        "user_id": current_user["_id"],
        "items": [item.dict() for item in payload.items],
        "address": payload.address.dict(),
        "shipping_method": payload.shipping_method,
        "shipping_cost": shipping_cost,
        "payment_method": payload.payment_method,
        "subtotal": subtotal,
        "total": total,
        "status": "paid",
        "created_at": datetime.utcnow().isoformat(),
    }
    await orders_collection.insert_one(order_doc)

    # Clear purchased items from cart
    cart = await cart_collection.find_one({"_id": current_user["_id"]})
    if cart:
        purchased_ids = {item.product_id for item in payload.items}
        remaining = [i for i in cart["items"] if i["product_id"] not in purchased_ids]
        await cart_collection.update_one(
            {"_id": current_user["_id"]}, {"$set": {"items": remaining}}
        )

    return serialize_order(order_doc)

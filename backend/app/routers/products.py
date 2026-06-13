from typing import Optional, List

from fastapi import APIRouter, Query

from app.database import products_collection, categories_collection

router = APIRouter(prefix="/api", tags=["products"])


def serialize_product(p: dict) -> dict:
    p["id"] = p["_id"]
    p.pop("_id", None)
    return p


@router.get("/categories")
async def list_categories():
    cats = await categories_collection.find().to_list(100)
    for c in cats:
        c["id"] = c.pop("_id") if "_id" in c else c["id"]
    return cats


@router.get("/products")
async def list_products(
    q: Optional[str] = None,
    category: Optional[str] = None,
    brand: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    min_rating: Optional[float] = None,
    flash_sale: Optional[bool] = None,
    sort: Optional[str] = Query(default="newest"),
):
    query: dict = {}
    if q:
        query["name"] = {"$regex": q, "$options": "i"}
    if category:
        query["category"] = {"$in": category.split(",")}
    if brand:
        query["brand"] = {"$in": brand.split(",")}
    if min_rating is not None:
        query["rating"] = {"$gte": min_rating}
    if flash_sale is not None:
        query["is_flash_sale"] = flash_sale
    price_filter = {}
    if min_price is not None:
        price_filter["$gte"] = min_price
    if max_price is not None:
        price_filter["$lte"] = max_price
    if price_filter:
        query["price"] = price_filter

    cursor = products_collection.find(query)
    products = await cursor.to_list(500)

    if sort == "price_asc":
        products.sort(key=lambda p: p["price"])
    elif sort == "price_desc":
        products.sort(key=lambda p: p["price"], reverse=True)
    elif sort == "rating":
        products.sort(key=lambda p: p["rating"], reverse=True)
    elif sort == "popular":
        products.sort(key=lambda p: p["sold"], reverse=True)

    return {
        "items": [serialize_product(p) for p in products],
        "total": len(products),
    }


@router.get("/products/{product_id}")
async def get_product(product_id: str):
    p = await products_collection.find_one({"_id": product_id})
    if not p:
        return {"error": "Product not found"}
    return serialize_product(p)


@router.get("/products/{product_id}/related")
async def get_related(product_id: str):
    p = await products_collection.find_one({"_id": product_id})
    if not p:
        return {"items": []}
    cursor = products_collection.find(
        {"category": p["category"], "_id": {"$ne": product_id}}
    ).limit(6)
    items = await cursor.to_list(6)
    return {"items": [serialize_product(i) for i in items]}

from fastapi import APIRouter, Depends

from app.database import wishlist_collection, products_collection
from app.auth import get_current_user
from app.routers.products import serialize_product

router = APIRouter(prefix="/api/wishlist", tags=["wishlist"])


@router.get("")
async def get_wishlist(current_user: dict = Depends(get_current_user)):
    doc = await wishlist_collection.find_one({"_id": current_user["_id"]})
    product_ids = doc["product_ids"] if doc else []
    products = await products_collection.find({"_id": {"$in": product_ids}}).to_list(200)
    return {"items": [serialize_product(p) for p in products]}


@router.post("/{product_id}")
async def add_to_wishlist(product_id: str, current_user: dict = Depends(get_current_user)):
    doc = await wishlist_collection.find_one({"_id": current_user["_id"]})
    ids = doc["product_ids"] if doc else []
    if product_id not in ids:
        ids.append(product_id)
    await wishlist_collection.update_one(
        {"_id": current_user["_id"]}, {"$set": {"product_ids": ids}}, upsert=True
    )
    return {"product_ids": ids}


@router.delete("/{product_id}")
async def remove_from_wishlist(product_id: str, current_user: dict = Depends(get_current_user)):
    doc = await wishlist_collection.find_one({"_id": current_user["_id"]})
    ids = doc["product_ids"] if doc else []
    ids = [i for i in ids if i != product_id]
    await wishlist_collection.update_one(
        {"_id": current_user["_id"]}, {"$set": {"product_ids": ids}}, upsert=True
    )
    return {"product_ids": ids}

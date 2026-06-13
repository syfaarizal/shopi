from fastapi import APIRouter, Depends, HTTPException

from app.database import cart_collection, products_collection
from app.auth import get_current_user
from app.models import CartItem, CartItemUpdate
from app.routers.products import serialize_product

router = APIRouter(prefix="/api/cart", tags=["cart"])


async def enrich_cart(items: list) -> list:
    result = []
    for item in items:
        product = await products_collection.find_one({"_id": item["product_id"]})
        if not product:
            continue
        result.append(
            {
                "product": serialize_product(product),
                "quantity": item["quantity"],
                "selected": item.get("selected", True),
            }
        )
    return result


@router.get("")
async def get_cart(current_user: dict = Depends(get_current_user)):
    cart = await cart_collection.find_one({"_id": current_user["_id"]})
    items = cart["items"] if cart else []
    return {"items": await enrich_cart(items)}


@router.post("")
async def add_to_cart(item: CartItem, current_user: dict = Depends(get_current_user)):
    cart = await cart_collection.find_one({"_id": current_user["_id"]})
    items = cart["items"] if cart else []

    for existing in items:
        if existing["product_id"] == item.product_id:
            existing["quantity"] += item.quantity
            break
    else:
        items.append(item.dict())

    await cart_collection.update_one(
        {"_id": current_user["_id"]}, {"$set": {"items": items}}, upsert=True
    )
    return {"items": await enrich_cart(items)}


@router.patch("/{product_id}")
async def update_cart_item(
    product_id: str, update: CartItemUpdate, current_user: dict = Depends(get_current_user)
):
    cart = await cart_collection.find_one({"_id": current_user["_id"]})
    if not cart:
        raise HTTPException(status_code=404, detail="Cart not found")
    items = cart["items"]
    for item in items:
        if item["product_id"] == product_id:
            if update.quantity is not None:
                item["quantity"] = max(1, update.quantity)
            if update.selected is not None:
                item["selected"] = update.selected
    await cart_collection.update_one({"_id": current_user["_id"]}, {"$set": {"items": items}})
    return {"items": await enrich_cart(items)}


@router.delete("/{product_id}")
async def remove_cart_item(product_id: str, current_user: dict = Depends(get_current_user)):
    cart = await cart_collection.find_one({"_id": current_user["_id"]})
    if not cart:
        return {"items": []}
    items = [i for i in cart["items"] if i["product_id"] != product_id]
    await cart_collection.update_one({"_id": current_user["_id"]}, {"$set": {"items": items}})
    return {"items": await enrich_cart(items)}

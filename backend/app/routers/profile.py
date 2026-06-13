import uuid

from fastapi import APIRouter, Depends

from app.database import users_collection
from app.auth import get_current_user
from app.models import Address

router = APIRouter(prefix="/api/profile", tags=["profile"])


@router.get("/addresses")
async def get_addresses(current_user: dict = Depends(get_current_user)):
    return {"items": current_user.get("addresses", [])}


@router.post("/addresses")
async def add_address(address: Address, current_user: dict = Depends(get_current_user)):
    addresses = current_user.get("addresses", [])
    new_address = address.dict()
    new_address["id"] = str(uuid.uuid4())
    if new_address.get("is_default") or not addresses:
        for a in addresses:
            a["is_default"] = False
        new_address["is_default"] = True
    addresses.append(new_address)
    await users_collection.update_one(
        {"_id": current_user["_id"]}, {"$set": {"addresses": addresses}}
    )
    return {"items": addresses}


@router.put("/me")
async def update_profile(payload: dict, current_user: dict = Depends(get_current_user)):
    allowed = {"name", "phone", "avatar"}
    update = {k: v for k, v in payload.items() if k in allowed}
    await users_collection.update_one({"_id": current_user["_id"]}, {"$set": update})
    return {"success": True}

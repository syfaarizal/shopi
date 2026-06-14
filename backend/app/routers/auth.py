import uuid

from fastapi import APIRouter, HTTPException, Depends, status

from app.database import users_collection
from app.models import UserRegister, UserLogin, TokenResponse, UserOut
from app.auth import hash_password, verify_password, create_access_token, get_current_user

router = APIRouter(prefix="/api/auth", tags=["auth"])


def serialize_user(user: dict) -> UserOut:
    return UserOut(
        id=user["_id"],
        name=user["name"],
        email=user["email"],
        phone=user.get("phone"),
        avatar=user.get("avatar"),
        role=user.get("role", "user"),   # ← include role
    )


@router.post("/register", response_model=TokenResponse)
async def register(payload: UserRegister):
    existing = await users_collection.find_one({"email": payload.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    user_id = str(uuid.uuid4())
    user_doc = {
        "_id": user_id,
        "name": payload.name,
        "email": payload.email,
        "password": hash_password(payload.password),
        "phone": None,
        "avatar": None,
        "role": "user",              # ← default role
        "addresses": [],
    }
    await users_collection.insert_one(user_doc)
    token = create_access_token({"sub": user_id})
    return TokenResponse(access_token=token, user=serialize_user(user_doc))


@router.post("/login", response_model=TokenResponse)
async def login(payload: UserLogin):
    user = await users_collection.find_one({"email": payload.email})
    if not user or not verify_password(payload.password, user["password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password"
        )
    token = create_access_token({"sub": user["_id"]})
    return TokenResponse(access_token=token, user=serialize_user(user))


@router.get("/me", response_model=UserOut)
async def me(current_user: dict = Depends(get_current_user)):
    return serialize_user(current_user)

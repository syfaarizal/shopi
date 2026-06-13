from typing import Optional, List
from pydantic import BaseModel, EmailStr, Field


# ---------- Auth ----------
class UserRegister(BaseModel):
    name: str
    email: EmailStr
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserOut(BaseModel):
    id: str
    name: str
    email: str
    phone: Optional[str] = None
    avatar: Optional[str] = None


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut


# ---------- Address ----------
class Address(BaseModel):
    id: Optional[str] = None
    label: str = "Home"
    name: str
    phone: str
    full_address: str
    is_default: bool = False


# ---------- Products ----------
class Product(BaseModel):
    id: str
    name: str
    slug: str
    category: str
    brand: str
    price: float
    original_price: Optional[float] = None
    discount: Optional[int] = None
    rating: float = 0
    review_count: int = 0
    sold: int = 0
    stock: int = 0
    images: List[str] = []
    description: str = ""
    is_flash_sale: bool = False


# ---------- Cart ----------
class CartItem(BaseModel):
    product_id: str
    quantity: int = 1
    selected: bool = True


class CartItemUpdate(BaseModel):
    quantity: Optional[int] = None
    selected: Optional[bool] = None


# ---------- Orders ----------
class OrderItem(BaseModel):
    product_id: str
    name: str
    image: str
    price: float
    quantity: int
    variant: Optional[str] = None


class OrderCreate(BaseModel):
    items: List[OrderItem]
    address: Address
    shipping_method: str  # "regular" | "express"
    payment_method: str  # "bank_transfer" | "ewallet" | "card"
    voucher: Optional[str] = None


class Order(BaseModel):
    id: str
    order_number: str
    user_id: str
    items: List[OrderItem]
    address: Address
    shipping_method: str
    shipping_cost: float
    payment_method: str
    subtotal: float
    total: float
    status: str  # pending, paid, shipped, delivered, cancelled
    created_at: str

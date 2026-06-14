import random
import uuid
from datetime import datetime, timedelta

from fastapi import APIRouter, Depends, HTTPException

from app.auth import get_current_user
from app.database import orders_collection
from app.models import PaymentInitiate

router = APIRouter(prefix="/api/payments", tags=["payments"])

# In-memory payment registry (use Redis/DB in production)
_payments: dict = {}


def _generate_va() -> str:
    return "8877" + "".join([str(random.randint(0, 9)) for _ in range(9)])


def _generate_qr_token() -> str:
    return "QR" + uuid.uuid4().hex[:16].upper()


@router.post("/initiate")
async def initiate_payment(
    payload: PaymentInitiate,
    current_user: dict = Depends(get_current_user),
):
    # Validate order belongs to user
    order = await orders_collection.find_one(
        {"_id": payload.order_id, "user_id": current_user["_id"]}
    )
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    payment_id = str(uuid.uuid4())
    expires_at = (datetime.utcnow() + timedelta(minutes=15)).isoformat()

    details: dict = {
        "payment_id": payment_id,
        "order_id": payload.order_id,
        "method": payload.method,
        "amount": payload.amount,
        "status": "pending",
        "expires_at": expires_at,
    }

    if payload.method == "bank_transfer":
        details["virtual_account"] = _generate_va()
        details["bank_name"] = random.choice(["BCA", "BNI", "Mandiri", "BRI"])
    elif payload.method == "ewallet":
        details["qr_token"] = _generate_qr_token()
        details["deeplink"] = f"gopay://pay?token={_generate_qr_token()}"
    elif payload.method == "card":
        details["processor"] = "Stripe (Sandbox)"

    _payments[payment_id] = details
    return details


@router.get("/{payment_id}")
async def get_payment(payment_id: str, _: dict = Depends(get_current_user)):
    payment = _payments.get(payment_id)
    if not payment:
        raise HTTPException(status_code=404, detail="Payment not found")
    return payment


@router.post("/confirm/{payment_id}")
async def confirm_payment(payment_id: str, _: dict = Depends(get_current_user)):
    """Dummy confirm — always succeeds in sandbox mode."""
    payment = _payments.get(payment_id)
    if not payment:
        raise HTTPException(status_code=404, detail="Payment not found")

    payment["status"] = "paid"

    # Update order status
    await orders_collection.update_one(
        {"_id": payment["order_id"]}, {"$set": {"status": "paid"}}
    )

    return {"payment_id": payment_id, "status": "paid", "order_id": payment["order_id"]}

import os
from datetime import datetime
from dotenv import load_dotenv
import stripe

from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.subscription import Subscription
from app.models.user import User
from app.utils.auth_dependency import get_current_user


load_dotenv()

stripe.api_key = os.getenv("STRIPE_SECRET_KEY")

STRIPE_PRICE_ID = os.getenv("STRIPE_PRICE_ID")
STRIPE_WEBHOOK_SECRET = os.getenv("STRIPE_WEBHOOK_SECRET")
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")


router = APIRouter(
    prefix="/payments",
    tags=["Payments"]
)


def get_or_create_subscription(db: Session, user_id: int):
    subscription = (
        db.query(Subscription)
        .filter(Subscription.user_id == user_id)
        .first()
    )

    if subscription:
        return subscription

    subscription = Subscription(
        user_id=user_id,
        status="inactive"
    )

    db.add(subscription)
    db.commit()
    db.refresh(subscription)

    return subscription


@router.post("/create-checkout-session")
def create_checkout_session(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if not stripe.api_key:
        raise HTTPException(
            status_code=500,
            detail="STRIPE_SECRET_KEY is missing"
        )

    if not STRIPE_PRICE_ID:
        raise HTTPException(
            status_code=500,
            detail="STRIPE_PRICE_ID is missing"
        )

    try:
        checkout_session = stripe.checkout.Session.create(
            mode="subscription",
            payment_method_types=["card"],
            customer_email=current_user.email,
            line_items=[
                {
                    "price": STRIPE_PRICE_ID,
                    "quantity": 1
                }
            ],
            success_url=f"{FRONTEND_URL}/payment-success?session_id={{CHECKOUT_SESSION_ID}}",
            cancel_url=f"{FRONTEND_URL}/payment-cancel",
            metadata={
                "user_id": str(current_user.id),
                "email": current_user.email
            }
        )

        return {
            "checkout_url": checkout_session.url
        }

    except Exception as error:
        raise HTTPException(
            status_code=400,
            detail=str(error)
        )


@router.get("/my-subscription")
def my_subscription(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    subscription = (
        db.query(Subscription)
        .filter(Subscription.user_id == current_user.id)
        .first()
    )

    if not subscription:
        return {
            "is_premium": False,
            "status": "inactive"
        }

    is_premium = subscription.status in ["active", "trialing"]

    return {
        "is_premium": is_premium,
        "status": subscription.status,
        "current_period_end": subscription.current_period_end,
        "stripe_subscription_id": subscription.stripe_subscription_id
    }


@router.post("/webhook")
async def stripe_webhook(
    request: Request,
    db: Session = Depends(get_db)
):
    payload = await request.body()
    signature = request.headers.get("stripe-signature")

    if STRIPE_WEBHOOK_SECRET:
        try:
            event = stripe.Webhook.construct_event(
                payload,
                signature,
                STRIPE_WEBHOOK_SECRET
            )
        except Exception as error:
            raise HTTPException(
                status_code=400,
                detail=f"Webhook signature verification failed: {str(error)}"
            )
    else:
        event = stripe.Event.construct_from(
            await request.json(),
            stripe.api_key
        )

    event_type = event["type"]
    data_object = event["data"]["object"]

    if event_type == "checkout.session.completed":
        metadata = getattr(data_object, "metadata", {}) or {}
        user_id = metadata.get("user_id")

        stripe_customer_id = getattr(data_object, "customer", None)
        stripe_subscription_id = getattr(data_object, "subscription", None)

        if user_id:
            subscription = get_or_create_subscription(db, int(user_id))

            subscription.stripe_customer_id = stripe_customer_id
            subscription.stripe_subscription_id = stripe_subscription_id
            subscription.status = "active"
            subscription.updated_at = datetime.utcnow()

            db.commit()

    if event_type in ["customer.subscription.created", "customer.subscription.updated", "customer.subscription.deleted"]:
        stripe_subscription_id = getattr(data_object, "id", None)
        status = getattr(data_object, "status", None)
        current_period_end = getattr(data_object, "current_period_end", None)

        subscription = (
            db.query(Subscription)
            .filter(Subscription.stripe_subscription_id == stripe_subscription_id)
            .first()
        )

        if subscription:
            subscription.status = status
            subscription.updated_at = datetime.utcnow()

            if current_period_end:
                subscription.current_period_end = datetime.fromtimestamp(
                    current_period_end
                )

            db.commit()

    return {
        "received": True
    }

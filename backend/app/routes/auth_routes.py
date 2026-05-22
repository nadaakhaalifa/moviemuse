from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.schemas.auth_schema import (
    AuthResponse,
    LoginRequest,
    RegisterRequest,
    ResendCodeRequest,
    UserResponse,
    VerifyEmailRequest,
)
from app.services.email_service import (
    generate_verification_code,
    get_code_expiry,
    send_verification_email,
)
from app.utils.security import (
    create_access_token,
    hash_password,
    verify_password,
)


router = APIRouter(
    prefix="/auth",
    tags=["Auth"]
)


@router.post("/register")
def register(
    request: RegisterRequest,
    db: Session = Depends(get_db)
):
    existing_user = db.query(User).filter(User.email == request.email).first()

    if existing_user and existing_user.is_verified:
        raise HTTPException(
            status_code=400,
            detail="Email is already registered"
        )

    code = generate_verification_code()
    expires_at = get_code_expiry()

    if existing_user and not existing_user.is_verified:
        existing_user.name = request.name
        existing_user.hashed_password = hash_password(request.password)
        existing_user.verification_code = code
        existing_user.verification_expires_at = expires_at

        db.commit()

        send_verification_email(existing_user.email, code)

        return {
            "message": "Verification code resent. Please check your email.",
            "email": existing_user.email
        }

    user = User(
        name=request.name,
        email=request.email,
        hashed_password=hash_password(request.password),
        is_verified=False,
        verification_code=code,
        verification_expires_at=expires_at
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    send_verification_email(user.email, code)

    return {
        "message": "Account created. Please verify your email.",
        "email": user.email
    }


@router.post("/verify-email")
def verify_email(
    request: VerifyEmailRequest,
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.email == request.email).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if user.is_verified:
        return {
            "message": "Email already verified"
        }

    if not user.verification_code:
        raise HTTPException(
            status_code=400,
            detail="No verification code found. Please request a new one."
        )

    if user.verification_code != request.code:
        raise HTTPException(
            status_code=400,
            detail="Invalid verification code"
        )

    if user.verification_expires_at < datetime.utcnow():
        raise HTTPException(
            status_code=400,
            detail="Verification code expired"
        )

    user.is_verified = True
    user.verification_code = None
    user.verification_expires_at = None

    db.commit()
    db.refresh(user)

    access_token = create_access_token({
        "sub": str(user.id),
        "email": user.email
    })

    return {
        "message": "Email verified successfully",
        "access_token": access_token,
        "token_type": "bearer",
        "user": UserResponse.model_validate(user)
    }


@router.post("/login", response_model=AuthResponse)
def login(
    request: LoginRequest,
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.email == request.email).first()

    if not user:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    if not verify_password(request.password, user.hashed_password):
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    if not user.is_verified:
        raise HTTPException(
            status_code=403,
            detail="Please verify your email before logging in"
        )

    access_token = create_access_token({
        "sub": str(user.id),
        "email": user.email
    })

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user
    }


@router.post("/resend-code")
def resend_code(
    request: ResendCodeRequest,
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.email == request.email).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if user.is_verified:
        raise HTTPException(
            status_code=400,
            detail="Email is already verified"
        )

    code = generate_verification_code()

    user.verification_code = code
    user.verification_expires_at = get_code_expiry()

    db.commit()

    send_verification_email(user.email, code)

    return {
        "message": "Verification code sent again",
        "email": user.email
    }
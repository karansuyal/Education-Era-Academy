from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.deps import get_current_admin
from app.core.security import (
    create_access_token,
    create_refresh_token,
    decode_token,
    verify_password,
)
from app.models.admin import AdminUser
from app.schemas.auth import AdminMeResponse, LoginRequest, RefreshRequest, TokenResponse

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/login", response_model=TokenResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    admin = db.query(AdminUser).filter(AdminUser.username == payload.username).first()

    # Same error for "no such user" and "wrong password" — don't help attackers enumerate usernames
    invalid_credentials = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Incorrect username or password",
    )

    if admin is None or not verify_password(payload.password, admin.hashed_password):
        raise invalid_credentials

    if not admin.is_active:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="This admin account is disabled")

    return TokenResponse(
        access_token=create_access_token(admin.username),
        refresh_token=create_refresh_token(admin.username),
    )


@router.post("/refresh", response_model=TokenResponse)
def refresh(payload: RefreshRequest, db: Session = Depends(get_db)):
    token_payload = decode_token(payload.refresh_token)

    invalid_token = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid or expired refresh token",
    )

    if token_payload is None or token_payload.get("type") != "refresh":
        raise invalid_token

    username = token_payload.get("sub")
    admin = db.query(AdminUser).filter(AdminUser.username == username).first()
    if admin is None or not admin.is_active:
        raise invalid_token

    # Issue a fresh pair (rotating the refresh token limits replay window)
    return TokenResponse(
        access_token=create_access_token(admin.username),
        refresh_token=create_refresh_token(admin.username),
    )


@router.get("/me", response_model=AdminMeResponse)
def read_current_admin(admin: AdminUser = Depends(get_current_admin)):
    return admin
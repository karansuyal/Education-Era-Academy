from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.deps import get_current_admin
from app.core.limiter import limiter
from app.core.security import (
    create_access_token,
    create_refresh_token,
    decode_token,
    verify_password,
)
from app.models.admin import AdminUser
from app.models.refresh_token import RefreshToken
from app.schemas.auth import AdminMeResponse, LoginRequest, LogoutRequest, RefreshRequest, TokenResponse

router = APIRouter(prefix="/auth", tags=["auth"])


def _issue_token_pair(db: Session, admin: AdminUser) -> TokenResponse:
    access_token = create_access_token(admin.username)
    refresh_token, jti, expires_at = create_refresh_token(admin.username)
    db.add(RefreshToken(jti=jti, admin_id=admin.id, expires_at=expires_at))
    db.commit()
    return TokenResponse(access_token=access_token, refresh_token=refresh_token)


@router.post("/login", response_model=TokenResponse)
@limiter.limit("5/minute")
def login(request: Request, payload: LoginRequest, db: Session = Depends(get_db)):
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

    return _issue_token_pair(db, admin)


@router.post("/refresh", response_model=TokenResponse)
def refresh(payload: RefreshRequest, db: Session = Depends(get_db)):
    token_payload = decode_token(payload.refresh_token)

    invalid_token = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid or expired refresh token",
    )

    if token_payload is None or token_payload.get("type") != "refresh":
        raise invalid_token

    jti = token_payload.get("jti")
    username = token_payload.get("sub")
    if not jti or not username:
        raise invalid_token

    # Must exist and not already be revoked (logged out, or already rotated
    # once — refresh tokens are single-use, so replaying an old one fails).
    stored = db.query(RefreshToken).filter(RefreshToken.jti == jti).first()
    if stored is None or stored.is_revoked:
        raise invalid_token

    admin = db.query(AdminUser).filter(AdminUser.username == username).first()
    if admin is None or not admin.is_active:
        raise invalid_token

    # Rotate: kill this refresh token so it can never be replayed again,
    # then issue a brand new access/refresh pair.
    stored.is_revoked = True
    db.commit()

    return _issue_token_pair(db, admin)


@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
def logout(payload: LogoutRequest, db: Session = Depends(get_db)):
    """Revokes a refresh token so it can no longer mint new access tokens.
    Call this from the admin panel's logout button. Silently no-ops on an
    already-invalid token — logging out should never itself error."""
    token_payload = decode_token(payload.refresh_token)
    if token_payload and token_payload.get("type") == "refresh":
        jti = token_payload.get("jti")
        if jti:
            stored = db.query(RefreshToken).filter(RefreshToken.jti == jti).first()
            if stored:
                stored.is_revoked = True
                db.commit()
    return None


@router.get("/me", response_model=AdminMeResponse)
def read_current_admin(admin: AdminUser = Depends(get_current_admin)):
    return admin
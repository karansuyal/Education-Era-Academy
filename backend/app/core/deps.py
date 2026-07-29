from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import decode_token
from app.models.admin import AdminUser

bearer_scheme = HTTPBearer(auto_error=False)


def get_current_admin(
    credentials: HTTPAuthorizationCredentials | None = Depends(bearer_scheme),
    db: Session = Depends(get_db),
) -> AdminUser:
    """Validates the Authorization: Bearer <access_token> header and returns
    the matching, active AdminUser. Raises 401 for any failure case so we
    don't leak *why* auth failed (expired vs invalid vs unknown user)."""

    unauthorized = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    if credentials is None:
        raise unauthorized

    payload = decode_token(credentials.credentials)
    if payload is None or payload.get("type") != "access":
        raise unauthorized

    username = payload.get("sub")
    if not username:
        raise unauthorized

    admin = db.query(AdminUser).filter(AdminUser.username == username).first()
    if admin is None or not admin.is_active:
        raise unauthorized

    return admin


def get_current_superadmin(admin: AdminUser = Depends(get_current_admin)) -> AdminUser:
    """Stricter dependency for actions only a superadmin should do
    (e.g. creating other admin accounts)."""
    if not admin.is_superadmin:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Superadmin access required")
    return admin
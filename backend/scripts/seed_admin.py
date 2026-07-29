"""
Creates the first admin account using FIRST_ADMIN_* values from .env.
Run once, after `alembic upgrade head`:

    python -m scripts.seed_admin
"""

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from app.core.config import settings
from app.core.database import SessionLocal
from app.core.security import hash_password
from app.models.admin import AdminUser


def seed_admin():
    db = SessionLocal()
    try:
        existing = db.query(AdminUser).filter(AdminUser.username == settings.FIRST_ADMIN_USERNAME).first()
        if existing:
            print(f"Admin '{settings.FIRST_ADMIN_USERNAME}' already exists — skipping.")
            return

        admin = AdminUser(
            username=settings.FIRST_ADMIN_USERNAME,
            email=settings.FIRST_ADMIN_EMAIL,
            hashed_password=hash_password(settings.FIRST_ADMIN_PASSWORD),
            is_active=True,
            is_superadmin=True,
        )
        db.add(admin)
        db.commit()
        print(f"Created superadmin '{admin.username}'. Login with the password from your .env file.")
    finally:
        db.close()


if __name__ == "__main__":
    seed_admin()
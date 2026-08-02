import datetime

from sqlalchemy import Boolean, DateTime, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


class LiveClass(Base):
    """A scheduled live class (Zoom / Google Meet link), set up by the
    admin. Times are stored naive (no timezone) — enter and read them in
    your own local time (IST) consistently everywhere."""

    __tablename__ = "live_classes"

    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(String(150), nullable=False)          # e.g. "Python — Loops & Conditionals"
    batch_label: Mapped[str] = mapped_column(String(100), default="", nullable=False)  # e.g. "Computer Applications"
    platform: Mapped[str] = mapped_column(String(30), default="Google Meet", nullable=False)  # "Zoom" / "Google Meet"
    meeting_link: Mapped[str] = mapped_column(String(500), nullable=False)
    scheduled_at: Mapped[datetime.datetime] = mapped_column(DateTime(timezone=False), nullable=False)
    duration_minutes: Mapped[int] = mapped_column(Integer, default=60, nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
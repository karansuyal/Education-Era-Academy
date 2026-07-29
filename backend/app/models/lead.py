from datetime import datetime

from sqlalchemy import Boolean, DateTime, String, Text
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.sql import func

from app.core.database import Base


class ContactLead(Base):
    """A contact-form enquiry. Also opens WhatsApp on the frontend, but now
    persisted here too so the admin has a proper leads list even if the
    student never actually sends the WhatsApp message."""

    __tablename__ = "contact_leads"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(120), nullable=False)
    phone: Mapped[str] = mapped_column(String(20), index=True, nullable=False)
    course_interested: Mapped[str] = mapped_column(String(120), nullable=False)
    message: Mapped[str] = mapped_column(Text, default="", nullable=False)
    is_contacted: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)  # admin marks follow-up done
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

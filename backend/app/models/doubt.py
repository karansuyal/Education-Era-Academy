from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func

from app.core.database import Base


class Doubt(Base):
    """A question a student posts against a chapter. The list is public —
    anyone can browse doubts + their answers for a chapter, like a mini Q&A
    board, so one teacher's answer helps every student who has the same
    question. Deleting a Chapter cascades and clears its doubts too."""

    __tablename__ = "doubts"

    id: Mapped[int] = mapped_column(primary_key=True)
    chapter_id: Mapped[int] = mapped_column(ForeignKey("chapters.id", ondelete="CASCADE"), nullable=False)
    student_name: Mapped[str] = mapped_column(String(120), nullable=False)
    student_phone: Mapped[str] = mapped_column(String(20), index=True, nullable=False)  # never exposed publicly
    question_text: Mapped[str] = mapped_column(Text, nullable=False)
    image_url: Mapped[str] = mapped_column(String(500), default="", nullable=False)  # optional photo of the question
    status: Mapped[str] = mapped_column(String(20), default="pending", nullable=False)  # pending | answered
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    chapter: Mapped["Chapter"] = relationship()
    replies: Mapped[list["DoubtReply"]] = relationship(
        back_populates="doubt", cascade="all, delete-orphan", order_by="DoubtReply.created_at"
    )


class DoubtReply(Base):
    """A teacher/admin's reply to a doubt. A doubt can have more than one
    reply (e.g. a follow-up clarification), each tagged with which admin
    wrote it."""

    __tablename__ = "doubt_replies"

    id: Mapped[int] = mapped_column(primary_key=True)
    doubt_id: Mapped[int] = mapped_column(ForeignKey("doubts.id", ondelete="CASCADE"), nullable=False)
    admin_id: Mapped[int | None] = mapped_column(ForeignKey("admin_users.id", ondelete="SET NULL"), nullable=True)
    reply_text: Mapped[str] = mapped_column(Text, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    doubt: Mapped["Doubt"] = relationship(back_populates="replies")
    admin: Mapped["AdminUser | None"] = relationship()

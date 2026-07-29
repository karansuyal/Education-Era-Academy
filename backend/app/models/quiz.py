from datetime import datetime

from sqlalchemy import Boolean, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func

from app.core.database import Base


class MockTest(Base):
    """A named test, e.g. 'Class 10 Maths - Chapter 1' or 'SSC CGL Weekly Mock #3'.

    Scoped to a class/subject label (free text, not FK) so the admin can
    create govt-exam tests too without forcing them into the academics tree.
    """

    __tablename__ = "mock_tests"

    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    description: Mapped[str] = mapped_column(Text, default="", nullable=False)
    class_label: Mapped[str] = mapped_column(String(80), default="", nullable=False)  # e.g. "Class 10", "Govt Exam"
    subject_label: Mapped[str] = mapped_column(String(80), default="", nullable=False)  # e.g. "Mathematics"
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    duration_minutes: Mapped[int] = mapped_column(Integer, default=0, nullable=False)  # 0 = untimed
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    questions: Mapped[list["Question"]] = relationship(
        back_populates="mock_test", cascade="all, delete-orphan", order_by="Question.order_index"
    )
    attempts: Mapped[list["Attempt"]] = relationship(back_populates="mock_test", cascade="all, delete-orphan")


class Question(Base):
    __tablename__ = "questions"

    id: Mapped[int] = mapped_column(primary_key=True)
    mock_test_id: Mapped[int] = mapped_column(ForeignKey("mock_tests.id", ondelete="CASCADE"), nullable=False)
    question_text: Mapped[str] = mapped_column(Text, nullable=False)
    options: Mapped[list[str]] = mapped_column(JSONB, nullable=False)  # e.g. ["60 km/h", "80 km/h", ...]
    correct_index: Mapped[int] = mapped_column(Integer, nullable=False)  # NEVER serialize this to public endpoints
    order_index: Mapped[int] = mapped_column(Integer, default=0, nullable=False)

    mock_test: Mapped["MockTest"] = relationship(back_populates="questions")


class Attempt(Base):
    """One student's attempt at a mock test. Scored server-side on submit."""

    __tablename__ = "attempts"

    id: Mapped[int] = mapped_column(primary_key=True)
    mock_test_id: Mapped[int] = mapped_column(ForeignKey("mock_tests.id", ondelete="CASCADE"), nullable=False)
    student_name: Mapped[str] = mapped_column(String(120), nullable=False)
    student_phone: Mapped[str] = mapped_column(String(20), index=True, nullable=False)
    score: Mapped[int] = mapped_column(Integer, nullable=False)
    total_questions: Mapped[int] = mapped_column(Integer, nullable=False)
    time_taken_seconds: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    submitted_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    mock_test: Mapped["MockTest"] = relationship(back_populates="attempts")
    answers: Mapped[list["AttemptAnswer"]] = relationship(
        back_populates="attempt", cascade="all, delete-orphan"
    )


class AttemptAnswer(Base):
    """Per-question record of what the student picked, for review/analytics."""

    __tablename__ = "attempt_answers"

    id: Mapped[int] = mapped_column(primary_key=True)
    attempt_id: Mapped[int] = mapped_column(ForeignKey("attempts.id", ondelete="CASCADE"), nullable=False)
    question_id: Mapped[int] = mapped_column(ForeignKey("questions.id", ondelete="CASCADE"), nullable=False)
    selected_index: Mapped[int] = mapped_column(Integer, nullable=False)
    is_correct: Mapped[bool] = mapped_column(Boolean, nullable=False)

    attempt: Mapped["Attempt"] = relationship(back_populates="answers")

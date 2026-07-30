from datetime import datetime

from pydantic import BaseModel, ConfigDict


# ---- MockTest ----
class MockTestCreate(BaseModel):
    title: str
    description: str = ""
    class_label: str = ""
    subject_label: str = ""
    is_active: bool = True
    duration_minutes: int = 0


class MockTestUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    class_label: str | None = None
    subject_label: str | None = None
    is_active: bool | None = None
    duration_minutes: int | None = None


class MockTestOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    title: str
    description: str
    class_label: str
    subject_label: str
    is_active: bool
    duration_minutes: int
    created_at: datetime


# ---- Question ----
class QuestionCreate(BaseModel):
    mock_test_id: int
    question_text: str
    options: list[str]
    correct_index: int
    order_index: int = 0


class QuestionUpdate(BaseModel):
    mock_test_id: int | None = None
    question_text: str | None = None
    options: list[str] | None = None
    correct_index: int | None = None
    order_index: int | None = None


class QuestionOut(BaseModel):
    """Admin-only view — includes correct_index. Never reuse this for the
    public quiz endpoint, which must strip the answer before sending."""

    model_config = ConfigDict(from_attributes=True)
    id: int
    mock_test_id: int
    question_text: str
    options: list[str]
    correct_index: int
    order_index: int


# ---- Attempt (read-only for admin) ----
class AttemptOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    mock_test_id: int
    student_name: str
    student_phone: str
    score: int
    total_questions: int
    time_taken_seconds: int
    submitted_at: datetime


class LeaderboardEntryOut(BaseModel):
    rank: int
    student_name: str
    student_phone: str
    score: int
    total_questions: int
    time_taken_seconds: int
    submitted_at: datetime

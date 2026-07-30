from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class MockTestListItemOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    title: str
    description: str
    class_label: str
    subject_label: str
    duration_minutes: int


class PublicQuestionOut(BaseModel):
    """Public-facing question — deliberately has NO correct_index field."""
    model_config = ConfigDict(from_attributes=True)
    id: int
    question_text: str
    options: list[str]


class MockTestDetailOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    title: str
    description: str
    class_label: str
    subject_label: str
    duration_minutes: int
    questions: list[PublicQuestionOut]


class AnswerIn(BaseModel):
    question_id: int
    selected_index: int = Field(..., ge=0)


class SubmitAttemptIn(BaseModel):
    student_name: str = Field(..., min_length=1, max_length=120)
    student_phone: str = Field(..., min_length=6, max_length=20)
    time_taken_seconds: int = Field(default=0, ge=0)
    answers: list[AnswerIn]


class SubmitAttemptOut(BaseModel):
    attempt_id: int
    score: int
    total_questions: int
    correct_question_ids: list[int]
    incorrect_question_ids: list[int]


class PublicLeaderboardEntryOut(BaseModel):
    rank: int
    student_name: str
    score: int
    total_questions: int
    time_taken_seconds: int
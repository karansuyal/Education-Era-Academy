from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class DoubtReplyAdminOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    admin_id: int | None
    reply_text: str
    created_at: datetime


class DoubtAdminOut(BaseModel):
    id: int
    chapter_id: int
    class_label: str
    subject_name: str
    chapter_title: str
    student_name: str
    student_phone: str
    question_text: str
    image_url: str
    status: str
    created_at: datetime
    replies: list[DoubtReplyAdminOut] = []


class DoubtReplyCreate(BaseModel):
    reply_text: str = Field(..., min_length=1, max_length=2000)

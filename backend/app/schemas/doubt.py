from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class DoubtReplyOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    reply_text: str
    created_at: datetime


class DoubtOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    chapter_id: int
    student_name: str
    question_text: str
    image_url: str
    status: str
    created_at: datetime
    replies: list[DoubtReplyOut] = []
    # student_phone intentionally NOT included here — never serialize it publicly


class DoubtCreate(BaseModel):
    chapter_id: int
    student_name: str = Field(..., min_length=1, max_length=120)
    student_phone: str = Field(..., min_length=6, max_length=20)
    question_text: str = Field(..., min_length=3, max_length=2000)
    image_url: str = Field(default="", max_length=500)


class DoubtSubmitOut(BaseModel):
    id: int
    message: str = "Your doubt has been posted. A teacher will reply soon."

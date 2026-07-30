from datetime import datetime

from pydantic import BaseModel, ConfigDict


class ContactLeadOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    name: str
    phone: str
    course_interested: str
    message: str
    is_contacted: bool
    created_at: datetime


class ContactLeadUpdate(BaseModel):
    is_contacted: bool | None = None

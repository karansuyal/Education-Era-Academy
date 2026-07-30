from pydantic import BaseModel, Field


class ContactLeadCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=120)
    phone: str = Field(..., min_length=6, max_length=20)
    course_interested: str = Field(..., min_length=1, max_length=120)
    message: str = Field(default="", max_length=2000)


class ContactLeadSubmitOut(BaseModel):
    id: int
    message: str = "Thanks! We'll get back to you shortly."
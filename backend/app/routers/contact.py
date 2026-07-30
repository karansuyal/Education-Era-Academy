from fastapi import APIRouter, Depends, Request, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.limiter import limiter
from app.models.lead import ContactLead
from app.schemas.contact import ContactLeadCreate, ContactLeadSubmitOut

router = APIRouter(prefix="/contact", tags=["contact"])


@router.post("", response_model=ContactLeadSubmitOut, status_code=status.HTTP_201_CREATED)
@limiter.limit("10/hour")
def submit_contact_lead(request: Request, payload: ContactLeadCreate, db: Session = Depends(get_db)):
    lead = ContactLead(
        name=payload.name.strip(),
        phone=payload.phone.strip(),
        course_interested=payload.course_interested.strip(),
        message=payload.message.strip(),
    )
    db.add(lead)
    db.commit()
    db.refresh(lead)
    return ContactLeadSubmitOut(id=lead.id)
from fastapi import APIRouter, Depends, Request, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.limiter import limiter
from app.core.telegram import send_telegram_notification
from app.core.ws_manager import leads_hub
from app.models.lead import ContactLead
from app.schemas.admin_leads import ContactLeadOut
from app.schemas.contact import ContactLeadCreate, ContactLeadSubmitOut

router = APIRouter(prefix="/contact", tags=["contact"])


@router.post("", response_model=ContactLeadSubmitOut, status_code=status.HTTP_201_CREATED)
@limiter.limit("10/hour")
async def submit_contact_lead(request: Request, payload: ContactLeadCreate, db: Session = Depends(get_db)):
    lead = ContactLead(
        name=payload.name.strip(),
        phone=payload.phone.strip(),
        course_interested=payload.course_interested.strip(),
        message=payload.message.strip(),
    )
    db.add(lead)
    db.commit()
    db.refresh(lead)

    await leads_hub.broadcast({"type": "new_lead", "lead": ContactLeadOut.model_validate(lead).model_dump()})

    send_telegram_notification(
        "🔔 <b>New Enquiry — Education Era Academy</b>\n"
        f"👤 Name: {lead.name}\n"
        f"📞 Phone: {lead.phone}\n"
        f"📚 Course: {lead.course_interested or '—'}\n"
        f"💬 Message: {lead.message or '—'}"
    )

    return ContactLeadSubmitOut(id=lead.id)
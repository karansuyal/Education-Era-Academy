from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.deps import get_current_admin
from app.models.lead import ContactLead
from backend.app.schemas.admin_leads import ContactLeadOut, ContactLeadUpdate

router = APIRouter(prefix="/admin/leads", tags=["admin:leads"])


@router.get("", response_model=list[ContactLeadOut])
def list_leads(
    is_contacted: bool | None = None,
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin),
):
    query = db.query(ContactLead)
    if is_contacted is not None:
        query = query.filter(ContactLead.is_contacted == is_contacted)
    return query.order_by(ContactLead.created_at.desc()).all()


@router.patch("/{lead_id}", response_model=ContactLeadOut)
def update_lead(
    lead_id: int,
    payload: ContactLeadUpdate,
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin),
):
    lead = db.get(ContactLead, lead_id)
    if lead is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Lead not found")

    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(lead, field, value)

    db.commit()
    db.refresh(lead)
    return lead


@router.delete("/{lead_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_lead(lead_id: int, db: Session = Depends(get_db), admin=Depends(get_current_admin)):
    lead = db.get(ContactLead, lead_id)
    if lead is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Lead not found")
    db.delete(lead)
    db.commit()
    return None

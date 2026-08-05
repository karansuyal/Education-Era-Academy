from fastapi import APIRouter, Depends, HTTPException, WebSocket, WebSocketDisconnect, status
from sqlalchemy.orm import Session

from app.core.database import SessionLocal, get_db
from app.core.deps import get_current_admin
from app.core.security import decode_token
from app.core.ws_manager import leads_hub
from app.models.admin import AdminUser
from app.models.lead import ContactLead
from app.schemas.admin_leads import ContactLeadOut, ContactLeadUpdate

router = APIRouter(prefix="/admin/leads", tags=["admin:leads"])


@router.websocket("/ws")
async def leads_live(websocket: WebSocket, token: str | None = None):
    """Live channel for new enquiries. Browsers can't send custom headers on
    a WebSocket handshake, so the admin's access token is passed as a query
    param instead (?token=...) and checked the same way get_current_admin
    checks the Authorization header on the REST endpoints."""
    payload = decode_token(token) if token else None
    if payload is None or payload.get("type") != "access":
        await websocket.close(code=4401)
        return

    db = SessionLocal()
    try:
        admin = db.query(AdminUser).filter(AdminUser.username == payload.get("sub")).first()
        if admin is None or not admin.is_active:
            await websocket.close(code=4401)
            return
    finally:
        db.close()

    await leads_hub.connect(websocket)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        await leads_hub.disconnect(websocket)


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
async def update_lead(
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

    await leads_hub.broadcast({"type": "lead_updated", "lead": ContactLeadOut.model_validate(lead).model_dump()})

    return lead


@router.delete("/{lead_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_lead(lead_id: int, db: Session = Depends(get_db), admin=Depends(get_current_admin)):
    lead = db.get(ContactLead, lead_id)
    if lead is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Lead not found")
    db.delete(lead)
    db.commit()

    await leads_hub.broadcast({"type": "lead_deleted", "lead_id": lead_id})

    return None
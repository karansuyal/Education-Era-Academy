from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, selectinload

from app.core.database import get_db
from app.core.deps import get_current_admin
from app.models.doubt import Doubt, DoubtReply
from app.schemas.admin_doubt import DoubtAdminOut, DoubtReplyCreate

router = APIRouter(prefix="/admin/doubts", tags=["admin:doubts"])


@router.get("", response_model=list[DoubtAdminOut])
def list_doubts(
    status_filter: str | None = None,
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin),
):
    """status_filter: 'pending' or 'answered'. Omit to see all doubts."""
    query = db.query(Doubt).options(selectinload(Doubt.replies))
    if status_filter:
        query = query.filter(Doubt.status == status_filter)
    return query.order_by(Doubt.created_at.desc()).all()


@router.post("/{doubt_id}/reply", response_model=DoubtAdminOut)
def reply_to_doubt(
    doubt_id: int,
    payload: DoubtReplyCreate,
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin),
):
    doubt = db.query(Doubt).options(selectinload(Doubt.replies)).filter(Doubt.id == doubt_id).first()
    if doubt is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Doubt not found")

    reply = DoubtReply(doubt_id=doubt.id, admin_id=admin.id, reply_text=payload.reply_text.strip())
    db.add(reply)
    doubt.status = "answered"
    db.commit()
    db.refresh(doubt)
    return doubt


@router.delete("/{doubt_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_doubt(doubt_id: int, db: Session = Depends(get_db), admin=Depends(get_current_admin)):
    doubt = db.get(Doubt, doubt_id)
    if doubt is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Doubt not found")
    db.delete(doubt)
    db.commit()
    return None

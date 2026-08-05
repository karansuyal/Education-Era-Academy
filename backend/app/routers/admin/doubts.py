from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, selectinload

from app.core.database import get_db
from app.core.deps import get_current_admin
from app.core.ws_manager import doubts_hub
from app.models.academics import Chapter, Subject
from app.models.doubt import Doubt, DoubtReply
from app.routers.doubts import _serialize as _serialize_public
from app.schemas.admin_doubt import DoubtAdminOut, DoubtReplyAdminOut, DoubtReplyCreate

router = APIRouter(prefix="/admin/doubts", tags=["admin:doubts"])


def _load_query(db: Session):
    return db.query(Doubt).options(
        selectinload(Doubt.replies),
        selectinload(Doubt.chapter).selectinload(Chapter.subject).selectinload(Subject.class_level),
    )


def _serialize(d: Doubt) -> DoubtAdminOut:
    return DoubtAdminOut(
        id=d.id,
        chapter_id=d.chapter_id,
        class_label=d.chapter.subject.class_level.label,
        subject_name=d.chapter.subject.name,
        chapter_title=d.chapter.title,
        student_name=d.student_name,
        student_phone=d.student_phone,
        question_text=d.question_text,
        image_url=d.image_url,
        status=d.status,
        created_at=d.created_at,
        replies=[
            DoubtReplyAdminOut(id=r.id, admin_id=r.admin_id, reply_text=r.reply_text, created_at=r.created_at)
            for r in d.replies
        ],
    )


@router.get("", response_model=list[DoubtAdminOut])
def list_doubts(
    status_filter: str | None = None,
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin),
):
    """status_filter: 'pending' or 'answered'. Omit to see all doubts."""
    query = _load_query(db)
    if status_filter:
        query = query.filter(Doubt.status == status_filter)
    doubts = query.order_by(Doubt.created_at.desc()).all()
    return [_serialize(d) for d in doubts]


@router.post("/{doubt_id}/reply", response_model=DoubtAdminOut)
async def reply_to_doubt(
    doubt_id: int,
    payload: DoubtReplyCreate,
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin),
):
    doubt = _load_query(db).filter(Doubt.id == doubt_id).first()
    if doubt is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Doubt not found")

    reply = DoubtReply(doubt_id=doubt.id, admin_id=admin.id, reply_text=payload.reply_text.strip())
    db.add(reply)
    doubt.status = "answered"
    db.commit()
    db.refresh(doubt)

    await doubts_hub.broadcast({"type": "doubt_updated", "doubt": _serialize_public(doubt).model_dump()})

    return _serialize(doubt)


@router.delete("/{doubt_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_doubt(doubt_id: int, db: Session = Depends(get_db), admin=Depends(get_current_admin)):
    doubt = db.get(Doubt, doubt_id)
    if doubt is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Doubt not found")
    db.delete(doubt)
    db.commit()

    await doubts_hub.broadcast({"type": "doubt_deleted", "doubt_id": doubt_id})

    return None
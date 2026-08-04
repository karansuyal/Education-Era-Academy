from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy.orm import Session, selectinload

from app.core.database import get_db
from app.core.limiter import limiter
from app.core.telegram import send_telegram_notification
from app.models.academics import Chapter
from app.models.doubt import Doubt
from app.schemas.doubt import DoubtCreate, DoubtOut, DoubtSubmitOut

router = APIRouter(prefix="/doubts", tags=["doubts"])


@router.get("", response_model=list[DoubtOut])
def list_doubts(chapter_id: int | None = None, db: Session = Depends(get_db)):
    """Public doubt board. Filter by chapter_id to show only that chapter's
    doubts (used on the Notes/Doubts page); omit it to show everything."""
    query = db.query(Doubt).options(selectinload(Doubt.replies))
    if chapter_id is not None:
        query = query.filter(Doubt.chapter_id == chapter_id)
    return query.order_by(Doubt.created_at.desc()).all()


@router.get("/{doubt_id}", response_model=DoubtOut)
def get_doubt(doubt_id: int, db: Session = Depends(get_db)):
    doubt = (
        db.query(Doubt)
        .options(selectinload(Doubt.replies))
        .filter(Doubt.id == doubt_id)
        .first()
    )
    if doubt is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Doubt not found")
    return doubt


@router.post("", response_model=DoubtSubmitOut, status_code=status.HTTP_201_CREATED)
@limiter.limit("10/hour")
def submit_doubt(request: Request, payload: DoubtCreate, db: Session = Depends(get_db)):
    chapter = db.get(Chapter, payload.chapter_id)
    if chapter is None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Chapter not found")

    doubt = Doubt(
        chapter_id=payload.chapter_id,
        student_name=payload.student_name.strip(),
        student_phone=payload.student_phone.strip(),
        question_text=payload.question_text.strip(),
        image_url=payload.image_url.strip(),
    )
    db.add(doubt)
    db.commit()
    db.refresh(doubt)

    # Best-effort ping to the teacher — never blocks/breaks the submission if it fails.
    send_telegram_notification(
        "New doubt posted on Education Era Academy.\n"
        f"Chapter: {chapter.title}\n"
        f"Student: {doubt.student_name}\n"
        f"Question: {doubt.question_text}"
    )

    return DoubtSubmitOut(id=doubt.id)

from fastapi import APIRouter, Depends, HTTPException, Request, WebSocket, WebSocketDisconnect, status
from sqlalchemy.orm import Session, selectinload

from app.core.database import get_db
from app.core.limiter import limiter
from app.core.telegram import send_telegram_notification
from app.core.ws_manager import doubts_hub
from app.models.academics import Chapter, Subject
from app.models.doubt import Doubt
from app.schemas.doubt import DoubtCreate, DoubtOut, DoubtReplyOut, DoubtSubmitOut

router = APIRouter(prefix="/doubts", tags=["doubts"])


def _load_query(db: Session):
    return db.query(Doubt).options(
        selectinload(Doubt.replies),
        selectinload(Doubt.chapter).selectinload(Chapter.subject).selectinload(Subject.class_level),
    )


def _serialize(d: Doubt) -> DoubtOut:
    return DoubtOut(
        id=d.id,
        chapter_id=d.chapter_id,
        class_label=d.chapter.subject.class_level.label,
        subject_name=d.chapter.subject.name,
        chapter_title=d.chapter.title,
        student_name=d.student_name,
        question_text=d.question_text,
        image_url=d.image_url,
        status=d.status,
        created_at=d.created_at,
        replies=[DoubtReplyOut(id=r.id, reply_text=r.reply_text, created_at=r.created_at) for r in d.replies],
    )


@router.get("", response_model=list[DoubtOut])
def list_doubts(chapter_id: int | None = None, db: Session = Depends(get_db)):
    """Public doubt feed — every student's doubt is visible to everyone, like a
    class-wide Q&A chat, so one teacher's answer helps every student who has
    the same question. chapter_id is an optional filter for a focused view."""
    query = _load_query(db)
    if chapter_id is not None:
        query = query.filter(Doubt.chapter_id == chapter_id)
    doubts = query.order_by(Doubt.created_at.desc()).all()
    return [_serialize(d) for d in doubts]


@router.get("/{doubt_id}", response_model=DoubtOut)
def get_doubt(doubt_id: int, db: Session = Depends(get_db)):
    doubt = _load_query(db).filter(Doubt.id == doubt_id).first()
    if doubt is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Doubt not found")
    return _serialize(doubt)


@router.websocket("/ws")
async def doubts_live(websocket: WebSocket):
    """Live channel: broadcasts new doubts, new replies, and deletions.
    No data is sent to the socket on its own — clients still fetch the
    feed once over REST, this just tells them when to update it."""
    await doubts_hub.connect(websocket)
    try:
        while True:
            # We don't expect the client to send anything; this just
            # keeps the connection open and detects disconnects.
            await websocket.receive_text()
    except WebSocketDisconnect:
        await doubts_hub.disconnect(websocket)


@router.post("", response_model=DoubtSubmitOut, status_code=status.HTTP_201_CREATED)
@limiter.limit("10/hour")
async def submit_doubt(request: Request, payload: DoubtCreate, db: Session = Depends(get_db)):
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

    await doubts_hub.broadcast({"type": "new_doubt", "doubt": _serialize(doubt).model_dump()})

    # Best-effort ping to the teacher — never blocks/breaks the submission if it fails.
    send_telegram_notification(
        "New doubt posted on Education Era Academy.\n"
        f"Chapter: {chapter.title}\n"
        f"Student: {doubt.student_name}\n"
        f"Question: {doubt.question_text}"
    )

    return DoubtSubmitOut(id=doubt.id)
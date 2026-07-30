from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session, selectinload

from app.core.database import get_db
from app.models.academics import Chapter, ClassLevel, Subject
from app.schemas.academics import ClassLevelOut

router = APIRouter(prefix="/academics", tags=["academics"])


@router.get("/classes", response_model=list[ClassLevelOut])
def list_classes(db: Session = Depends(get_db)):
    """Returns the full Class -> Subject -> Chapter -> Notes tree in one
    call — this is what the Notes page's class/subject tabs read from.
    selectinload avoids N+1 queries for the nested relationships."""

    classes = (
        db.query(ClassLevel)
        .options(
            selectinload(ClassLevel.subjects)
            .selectinload(Subject.chapters)
            .selectinload(Chapter.notes)
        )
        .order_by(ClassLevel.order_index)
        .all()
    )
    return classes
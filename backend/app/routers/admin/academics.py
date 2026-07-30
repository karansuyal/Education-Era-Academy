from fastapi import APIRouter

from app.core.crud_factory import build_crud_router
from app.models.academics import Chapter, ClassLevel, Note, Subject
from app.schemas.academics import ChapterOut, ClassLevelOut, NoteOut, SubjectOut
from app.schemas.admin_academics import (
    ChapterCreate,
    ChapterUpdate,
    ClassLevelCreate,
    ClassLevelUpdate,
    NoteCreate,
    NoteUpdate,
    SubjectCreate,
    SubjectUpdate,
)

router = APIRouter(prefix="/admin/academics", tags=["admin:academics"])

# Note: these use the flat Out schemas (ClassLevelOut/SubjectOut/etc. from
# schemas/academics.py include nested children) — that's fine for GET-by-id
# and list, but create/update responses will just show empty nested lists
# for a freshly created row, which is expected since it has no children yet.

router.include_router(
    build_crud_router(
        model=ClassLevel, create_schema=ClassLevelCreate, update_schema=ClassLevelUpdate,
        out_schema=ClassLevelOut, prefix="/classes", tag="admin:academics:classes",
    )
)
router.include_router(
    build_crud_router(
        model=Subject, create_schema=SubjectCreate, update_schema=SubjectUpdate,
        out_schema=SubjectOut, prefix="/subjects", tag="admin:academics:subjects",
    )
)
router.include_router(
    build_crud_router(
        model=Chapter, create_schema=ChapterCreate, update_schema=ChapterUpdate,
        out_schema=ChapterOut, prefix="/chapters", tag="admin:academics:chapters",
    )
)
router.include_router(
    build_crud_router(
        model=Note, create_schema=NoteCreate, update_schema=NoteUpdate,
        out_schema=NoteOut, prefix="/notes", tag="admin:academics:notes",
    )
)

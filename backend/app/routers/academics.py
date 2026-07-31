from fastapi import APIRouter

from app.core.crud_factory import build_crud_router
from app.models.academics import Chapter, ClassLevel, Note, Subject
from app.schemas.admin_academics import (
    ChapterAdminOut,
    ChapterCreate,
    ChapterUpdate,
    ClassLevelAdminOut,
    ClassLevelCreate,
    ClassLevelUpdate,
    NoteAdminOut,
    NoteCreate,
    NoteUpdate,
    SubjectAdminOut,
    SubjectCreate,
    SubjectUpdate,
)

router = APIRouter(prefix="/admin/academics", tags=["admin:academics"])

# Note: these use flat admin Out schemas (ClassLevelAdminOut/SubjectAdminOut/etc.
# from schemas/admin_academics.py) which include parent ids + order_index —
# required by the admin panel's client-side filtering. The public "Out"
# schemas (schemas/academics.py) are nested and intentionally omit those ids,
# so they aren't suitable here.

router.include_router(
    build_crud_router(
        model=ClassLevel, create_schema=ClassLevelCreate, update_schema=ClassLevelUpdate,
        out_schema=ClassLevelAdminOut, prefix="/classes", tag="admin:academics:classes",
    )
)
router.include_router(
    build_crud_router(
        model=Subject, create_schema=SubjectCreate, update_schema=SubjectUpdate,
        out_schema=SubjectAdminOut, prefix="/subjects", tag="admin:academics:subjects",
    )
)
router.include_router(
    build_crud_router(
        model=Chapter, create_schema=ChapterCreate, update_schema=ChapterUpdate,
        out_schema=ChapterAdminOut, prefix="/chapters", tag="admin:academics:chapters",
    )
)
router.include_router(
    build_crud_router(
        model=Note, create_schema=NoteCreate, update_schema=NoteUpdate,
        out_schema=NoteAdminOut, prefix="/notes", tag="admin:academics:notes",
    )
)
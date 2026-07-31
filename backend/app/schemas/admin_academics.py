from pydantic import BaseModel, ConfigDict


# ---- Admin list/read schemas ----
# These are flat (no nested children) and include parent-id + order_index
# fields, which the admin panel needs for client-side filtering/sorting.
# The public schemas/academics.py "Out" schemas are nested and omit these
# ids, so they can't be reused here.

class ClassLevelAdminOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    slug: str
    label: str
    order_index: int


class SubjectAdminOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    class_level_id: int
    slug: str
    name: str
    youtube_id: str
    order_index: int


class ChapterAdminOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    subject_id: int
    title: str
    youtube_id: str
    order_index: int


class NoteAdminOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    chapter_id: int
    title: str
    link: str
    order_index: int


# ---- ClassLevel ----
class ClassLevelCreate(BaseModel):
    slug: str
    label: str
    order_index: int = 0


class ClassLevelUpdate(BaseModel):
    slug: str | None = None
    label: str | None = None
    order_index: int | None = None


# ---- Subject ----
class SubjectCreate(BaseModel):
    class_level_id: int
    slug: str
    name: str
    youtube_id: str = ""
    order_index: int = 0


class SubjectUpdate(BaseModel):
    class_level_id: int | None = None
    slug: str | None = None
    name: str | None = None
    youtube_id: str | None = None
    order_index: int | None = None


# ---- Chapter ----
class ChapterCreate(BaseModel):
    subject_id: int
    title: str
    youtube_id: str = ""
    order_index: int = 0


class ChapterUpdate(BaseModel):
    subject_id: int | None = None
    title: str | None = None
    youtube_id: str | None = None
    order_index: int | None = None


# ---- Note ----
class NoteCreate(BaseModel):
    chapter_id: int
    title: str
    link: str
    order_index: int = 0


class NoteUpdate(BaseModel):
    chapter_id: int | None = None
    title: str | None = None
    link: str | None = None
    order_index: int | None = None
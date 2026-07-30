import datetime

from pydantic import BaseModel, ConfigDict


# ---- StatItem ----
class StatItemCreate(BaseModel):
    num: str
    label: str
    order_index: int = 0


class StatItemUpdate(BaseModel):
    num: str | None = None
    label: str | None = None
    order_index: int | None = None


class StatItemAdminOut(StatItemCreate):
    model_config = ConfigDict(from_attributes=True)
    id: int


# ---- WhyPoint ----
class WhyPointCreate(BaseModel):
    code: str
    title: str
    desc: str
    order_index: int = 0


class WhyPointUpdate(BaseModel):
    code: str | None = None
    title: str | None = None
    desc: str | None = None
    order_index: int | None = None


class WhyPointAdminOut(WhyPointCreate):
    model_config = ConfigDict(from_attributes=True)
    id: int


# ---- Batch ----
class BatchCreate(BaseModel):
    code: str
    title: str
    desc: str
    meta: list[str] = []
    featured: bool = False
    order_index: int = 0


class BatchUpdate(BaseModel):
    code: str | None = None
    title: str | None = None
    desc: str | None = None
    meta: list[str] | None = None
    featured: bool | None = None
    order_index: int | None = None


class BatchAdminOut(BatchCreate):
    model_config = ConfigDict(from_attributes=True)
    id: int


# ---- FacultyMember ----
class FacultyMemberCreate(BaseModel):
    initials: str
    name: str
    detail: str
    order_index: int = 0


class FacultyMemberUpdate(BaseModel):
    initials: str | None = None
    name: str | None = None
    detail: str | None = None
    order_index: int | None = None


class FacultyMemberAdminOut(FacultyMemberCreate):
    model_config = ConfigDict(from_attributes=True)
    id: int


# ---- ResultHighlight ----
class ResultHighlightCreate(BaseModel):
    tag: str
    name: str
    exam: str
    order_index: int = 0


class ResultHighlightUpdate(BaseModel):
    tag: str | None = None
    name: str | None = None
    exam: str | None = None
    order_index: int | None = None


class ResultHighlightAdminOut(ResultHighlightCreate):
    model_config = ConfigDict(from_attributes=True)
    id: int


# ---- Testimonial ----
class TestimonialCreate(BaseModel):
    quote: str
    author: str
    order_index: int = 0


class TestimonialUpdate(BaseModel):
    quote: str | None = None
    author: str | None = None
    order_index: int | None = None


class TestimonialAdminOut(TestimonialCreate):
    model_config = ConfigDict(from_attributes=True)
    id: int


# ---- GalleryItem ----
class GalleryItemCreate(BaseModel):
    type: str  # "image" | "video"
    label: str
    caption: str = ""
    src: str = ""
    youtube_id: str = ""
    poster: str = ""
    order_index: int = 0


class GalleryItemUpdate(BaseModel):
    type: str | None = None
    label: str | None = None
    caption: str | None = None
    src: str | None = None
    youtube_id: str | None = None
    poster: str | None = None
    order_index: int | None = None


class GalleryItemAdminOut(GalleryItemCreate):
    model_config = ConfigDict(from_attributes=True)
    id: int


# ---- FAQItem ----
class FAQItemCreate(BaseModel):
    q: str
    a: str
    order_index: int = 0


class FAQItemUpdate(BaseModel):
    q: str | None = None
    a: str | None = None
    order_index: int | None = None


class FAQItemAdminOut(FAQItemCreate):
    model_config = ConfigDict(from_attributes=True)
    id: int


# ---- FeePlan ----
class FeePlanCreate(BaseModel):
    name: str
    price_full: str
    price_emi: str
    includes: list[str] = []
    featured: bool = False
    order_index: int = 0


class FeePlanUpdate(BaseModel):
    name: str | None = None
    price_full: str | None = None
    price_emi: str | None = None
    includes: list[str] | None = None
    featured: bool | None = None
    order_index: int | None = None


class FeePlanAdminOut(FeePlanCreate):
    model_config = ConfigDict(from_attributes=True)
    id: int


# ---- BlogPost ----
class BlogPostCreate(BaseModel):
    slug: str
    date: datetime.date
    title: str
    excerpt: str
    content: str
    is_published: bool = True


class BlogPostUpdate(BaseModel):
    slug: str | None = None
    date: datetime.date | None = None
    title: str | None = None
    excerpt: str | None = None
    content: str | None = None
    is_published: bool | None = None


class BlogPostAdminOut(BlogPostCreate):
    model_config = ConfigDict(from_attributes=True)
    id: int


# ---- SiteSettings (singleton, PUT only) ----
class SiteSettingsUpdate(BaseModel):
    name: str | None = None
    name_suffix: str | None = None
    tagline: str | None = None
    phone: str | None = None
    whatsapp_number: str | None = None
    email: str | None = None
    address: str | None = None
    map_embed_url: str | None = None
    youtube_name: str | None = None
    youtube_handle: str | None = None
    youtube_url: str | None = None
    youtube_channel_id: str | None = None
    youtube_description: str | None = None


class SiteSettingsAdminOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    name: str
    name_suffix: str
    tagline: str
    phone: str
    whatsapp_number: str
    email: str
    address: str
    map_embed_url: str
    youtube_name: str
    youtube_handle: str
    youtube_url: str
    youtube_channel_id: str
    youtube_description: str

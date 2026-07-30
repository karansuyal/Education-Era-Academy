from datetime import date, datetime

from pydantic import BaseModel, ConfigDict


class SiteInfoOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

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


class StatItemOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    num: str
    label: str


class WhyPointOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    code: str
    title: str
    desc: str


class BatchOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    code: str
    title: str
    desc: str
    meta: list[str]
    featured: bool


class FacultyMemberOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    initials: str
    name: str
    detail: str


class ResultHighlightOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    tag: str
    name: str
    exam: str


class TestimonialOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    quote: str
    author: str


class GalleryItemOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    type: str
    label: str
    caption: str
    src: str
    youtube_id: str
    poster: str


class FAQItemOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    q: str
    a: str


class FeePlanOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    name: str
    price_full: str
    price_emi: str
    includes: list[str]
    featured: bool


class SiteContentBundle(BaseModel):
    """Everything the homepage needs in one call — mirrors the old content.js
    exports (minus blog posts and academics, which have their own endpoints
    since they can grow large)."""

    site_info: SiteInfoOut
    stats: list[StatItemOut]
    why_points: list[WhyPointOut]
    batches: list[BatchOut]
    faculty: list[FacultyMemberOut]
    results: list[ResultHighlightOut]
    testimonials: list[TestimonialOut]
    gallery: list[GalleryItemOut]
    faqs: list[FAQItemOut]
    fee_plans: list[FeePlanOut]


class BlogPostListItemOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    slug: str
    date: date
    title: str
    excerpt: str


class BlogPostDetailOut(BlogPostListItemOut):
    content: str
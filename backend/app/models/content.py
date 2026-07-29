from datetime import date, datetime

from sqlalchemy import Boolean, Date, DateTime, Integer, String, Text
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.sql import func

from app.core.database import Base


class SiteSettings(Base):
    """Singleton row (always id=1) holding the site-wide fields that used
    to be `siteInfo` + `youtubeChannel` in content.js."""

    __tablename__ = "site_settings"

    id: Mapped[int] = mapped_column(primary_key=True, default=1)

    name: Mapped[str] = mapped_column(String(120), default="Education Era")
    name_suffix: Mapped[str] = mapped_column(String(120), default="Academy")
    tagline: Mapped[str] = mapped_column(String(200), default="")
    phone: Mapped[str] = mapped_column(String(30), default="")
    whatsapp_number: Mapped[str] = mapped_column(String(30), default="")
    email: Mapped[str] = mapped_column(String(255), default="")
    address: Mapped[str] = mapped_column(String(300), default="")
    map_embed_url: Mapped[str] = mapped_column(Text, default="")

    youtube_name: Mapped[str] = mapped_column(String(120), default="")
    youtube_handle: Mapped[str] = mapped_column(String(120), default="")
    youtube_url: Mapped[str] = mapped_column(String(300), default="")
    youtube_channel_id: Mapped[str] = mapped_column(String(60), default="")
    youtube_description: Mapped[str] = mapped_column(Text, default="")

    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), onupdate=func.now(), server_default=func.now())


class StatItem(Base):
    """e.g. { num: '1,200+', label: 'students mentored' }"""

    __tablename__ = "stat_items"

    id: Mapped[int] = mapped_column(primary_key=True)
    num: Mapped[str] = mapped_column(String(40), nullable=False)
    label: Mapped[str] = mapped_column(String(120), nullable=False)
    order_index: Mapped[int] = mapped_column(Integer, default=0, nullable=False)


class WhyPoint(Base):
    __tablename__ = "why_points"

    id: Mapped[int] = mapped_column(primary_key=True)
    code: Mapped[str] = mapped_column(String(30), nullable=False)  # e.g. "RN-01"
    title: Mapped[str] = mapped_column(String(150), nullable=False)
    desc: Mapped[str] = mapped_column(Text, nullable=False)
    order_index: Mapped[int] = mapped_column(Integer, default=0, nullable=False)


class Batch(Base):
    __tablename__ = "batches"

    id: Mapped[int] = mapped_column(primary_key=True)
    code: Mapped[str] = mapped_column(String(60), nullable=False)  # e.g. "BATCH / FND-9-10"
    title: Mapped[str] = mapped_column(String(150), nullable=False)
    desc: Mapped[str] = mapped_column(Text, nullable=False)
    meta: Mapped[list[str]] = mapped_column(JSONB, default=list)  # e.g. ["Mon-Sat . 2 hrs/day", "Weekly tests"]
    featured: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    order_index: Mapped[int] = mapped_column(Integer, default=0, nullable=False)


class FacultyMember(Base):
    __tablename__ = "faculty_members"

    id: Mapped[int] = mapped_column(primary_key=True)
    initials: Mapped[str] = mapped_column(String(10), nullable=False)
    name: Mapped[str] = mapped_column(String(150), nullable=False)
    detail: Mapped[str] = mapped_column(Text, nullable=False)
    order_index: Mapped[int] = mapped_column(Integer, default=0, nullable=False)


class ResultHighlight(Base):
    __tablename__ = "result_highlights"

    id: Mapped[int] = mapped_column(primary_key=True)
    tag: Mapped[str] = mapped_column(String(40), nullable=False)  # e.g. "AIR 412", "98.2%"
    name: Mapped[str] = mapped_column(String(150), nullable=False)
    exam: Mapped[str] = mapped_column(String(150), nullable=False)
    order_index: Mapped[int] = mapped_column(Integer, default=0, nullable=False)


class Testimonial(Base):
    __tablename__ = "testimonials"

    id: Mapped[int] = mapped_column(primary_key=True)
    quote: Mapped[str] = mapped_column(Text, nullable=False)
    author: Mapped[str] = mapped_column(String(150), nullable=False)
    order_index: Mapped[int] = mapped_column(Integer, default=0, nullable=False)


class GalleryItem(Base):
    __tablename__ = "gallery_items"

    id: Mapped[int] = mapped_column(primary_key=True)
    type: Mapped[str] = mapped_column(String(10), nullable=False)  # "image" | "video"
    label: Mapped[str] = mapped_column(String(120), nullable=False)
    caption: Mapped[str] = mapped_column(String(300), default="")
    src: Mapped[str] = mapped_column(String(500), default="")         # image path or self-hosted video path
    youtube_id: Mapped[str] = mapped_column(String(50), default="")   # used when type == "video" and no src
    poster: Mapped[str] = mapped_column(String(500), default="")      # optional video thumbnail
    order_index: Mapped[int] = mapped_column(Integer, default=0, nullable=False)


class FAQItem(Base):
    __tablename__ = "faq_items"

    id: Mapped[int] = mapped_column(primary_key=True)
    q: Mapped[str] = mapped_column(String(300), nullable=False)
    a: Mapped[str] = mapped_column(Text, nullable=False)
    order_index: Mapped[int] = mapped_column(Integer, default=0, nullable=False)


class FeePlan(Base):
    __tablename__ = "fee_plans"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(150), nullable=False)
    price_full: Mapped[str] = mapped_column(String(60), nullable=False)   # e.g. "Rs 12,000"
    price_emi: Mapped[str] = mapped_column(String(80), nullable=False)    # e.g. "Rs 1,000 x 12 months"
    includes: Mapped[list[str]] = mapped_column(JSONB, default=list)
    featured: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    order_index: Mapped[int] = mapped_column(Integer, default=0, nullable=False)


class BlogPost(Base):
    __tablename__ = "blog_posts"

    id: Mapped[int] = mapped_column(primary_key=True)
    slug: Mapped[str] = mapped_column(String(200), unique=True, index=True, nullable=False)
    date: Mapped[date] = mapped_column(Date, nullable=False)
    title: Mapped[str] = mapped_column(String(250), nullable=False)
    excerpt: Mapped[str] = mapped_column(Text, nullable=False)
    content: Mapped[str] = mapped_column(Text, nullable=False)
    is_published: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

from sqlalchemy import ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class ClassLevel(Base):
    """A top-level tab, e.g. 'Class 9', 'Class 10', 'Government Exam'."""

    __tablename__ = "class_levels"

    id: Mapped[int] = mapped_column(primary_key=True)
    slug: Mapped[str] = mapped_column(String(60), unique=True, index=True, nullable=False)  # e.g. "class-9"
    label: Mapped[str] = mapped_column(String(120), nullable=False)  # e.g. "Class 9"
    order_index: Mapped[int] = mapped_column(Integer, default=0, nullable=False)

    subjects: Mapped[list["Subject"]] = relationship(
        back_populates="class_level", cascade="all, delete-orphan", order_by="Subject.order_index"
    )


class Subject(Base):
    """e.g. 'Mathematics' under Class 9."""

    __tablename__ = "subjects"

    id: Mapped[int] = mapped_column(primary_key=True)
    class_level_id: Mapped[int] = mapped_column(ForeignKey("class_levels.id", ondelete="CASCADE"), nullable=False)
    slug: Mapped[str] = mapped_column(String(80), index=True, nullable=False)  # e.g. "class-9-maths"
    name: Mapped[str] = mapped_column(String(120), nullable=False)
    youtube_id: Mapped[str] = mapped_column(String(50), default="", nullable=False)  # optional subject-level video
    order_index: Mapped[int] = mapped_column(Integer, default=0, nullable=False)

    class_level: Mapped["ClassLevel"] = relationship(back_populates="subjects")
    chapters: Mapped[list["Chapter"]] = relationship(
        back_populates="subject", cascade="all, delete-orphan", order_by="Chapter.order_index"
    )


class Chapter(Base):
    """e.g. 'Real Numbers' under Class 10 -> Mathematics."""

    __tablename__ = "chapters"

    id: Mapped[int] = mapped_column(primary_key=True)
    subject_id: Mapped[int] = mapped_column(ForeignKey("subjects.id", ondelete="CASCADE"), nullable=False)
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    youtube_id: Mapped[str] = mapped_column(String(50), default="", nullable=False)  # "" -> "Video coming soon"
    order_index: Mapped[int] = mapped_column(Integer, default=0, nullable=False)

    subject: Mapped["Subject"] = relationship(back_populates="chapters")
    notes: Mapped[list["Note"]] = relationship(
        back_populates="chapter", cascade="all, delete-orphan", order_by="Note.order_index"
    )


class Note(Base):
    """A single downloadable PDF attached to a chapter. A chapter can have 0+ notes."""

    __tablename__ = "notes"

    id: Mapped[int] = mapped_column(primary_key=True)
    chapter_id: Mapped[int] = mapped_column(ForeignKey("chapters.id", ondelete="CASCADE"), nullable=False)
    title: Mapped[str] = mapped_column(String(200), nullable=False)  # e.g. "Real Numbers Notes (PDF)"
    link: Mapped[str] = mapped_column(String(500), nullable=False)  # e.g. "/notes/real-numbers.pdf" or S3 URL
    order_index: Mapped[int] = mapped_column(Integer, default=0, nullable=False)

    chapter: Mapped["Chapter"] = relationship(back_populates="notes")

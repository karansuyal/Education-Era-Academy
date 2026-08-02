from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.content import (
    Batch,
    BlogPost,
    FacultyMember,
    FAQItem,
    FeePlan,
    GalleryItem,
    ResultHighlight,
    SiteSettings,
    StatItem,
    Testimonial,
    WhyPoint,
)
from app.models.live_class import LiveClass
from app.schemas.content import (
    BatchOut,
    BlogPostDetailOut,
    BlogPostListItemOut,
    FacultyMemberOut,
    FAQItemOut,
    FeePlanOut,
    GalleryItemOut,
    LiveClassOut,
    ResultHighlightOut,
    SiteContentBundle,
    SiteInfoOut,
    StatItemOut,
    TestimonialOut,
    WhyPointOut,
)

router = APIRouter(prefix="/public", tags=["public"])


def _get_or_create_site_settings(db: Session) -> SiteSettings:
    """SiteSettings is a singleton (id=1). Auto-create an empty row the
    first time it's requested so the endpoint never 404s — the admin
    panel then just fills in the blanks."""
    settings_row = db.get(SiteSettings, 1)
    if settings_row is None:
        settings_row = SiteSettings(id=1)
        db.add(settings_row)
        db.commit()
        db.refresh(settings_row)
    return settings_row


@router.get("/site-content", response_model=SiteContentBundle)
def get_site_content(db: Session = Depends(get_db)):
    """One call for everything the homepage needs — replaces the old
    content.js imports (siteInfo, stats, whyPoints, batches, faculty,
    results, testimonials, gallery, faqs, feePlans)."""

    return SiteContentBundle(
        site_info=SiteInfoOut.model_validate(_get_or_create_site_settings(db)),
        stats=[StatItemOut.model_validate(x) for x in db.query(StatItem).order_by(StatItem.order_index).all()],
        why_points=[WhyPointOut.model_validate(x) for x in db.query(WhyPoint).order_by(WhyPoint.order_index).all()],
        batches=[BatchOut.model_validate(x) for x in db.query(Batch).order_by(Batch.order_index).all()],
        faculty=[
            FacultyMemberOut.model_validate(x)
            for x in db.query(FacultyMember).order_by(FacultyMember.order_index).all()
        ],
        results=[
            ResultHighlightOut.model_validate(x)
            for x in db.query(ResultHighlight).order_by(ResultHighlight.order_index).all()
        ],
        testimonials=[
            TestimonialOut.model_validate(x) for x in db.query(Testimonial).order_by(Testimonial.order_index).all()
        ],
        gallery=[
            GalleryItemOut.model_validate(x) for x in db.query(GalleryItem).order_by(GalleryItem.order_index).all()
        ],
        faqs=[FAQItemOut.model_validate(x) for x in db.query(FAQItem).order_by(FAQItem.order_index).all()],
        fee_plans=[FeePlanOut.model_validate(x) for x in db.query(FeePlan).order_by(FeePlan.order_index).all()],
        # scheduled_at is stored as a naive local (IST) time, not UTC, so we
        # don't filter "already finished" classes out here — comparing a
        # naive local time against the server's UTC clock would be
        # unreliable. The frontend filters using the visitor's own clock
        # instead. Turn "Is Active" off in the admin panel once a class is
        # done if you'd rather remove it outright.
        live_classes=[
            LiveClassOut.model_validate(x)
            for x in db.query(LiveClass).filter(LiveClass.is_active.is_(True)).order_by(LiveClass.scheduled_at).all()
        ],
    )


@router.get("/blog", response_model=list[BlogPostListItemOut])
def list_blog_posts(db: Session = Depends(get_db)):
    posts = (
        db.query(BlogPost)
        .filter(BlogPost.is_published.is_(True))
        .order_by(BlogPost.date.desc())
        .all()
    )
    return posts


@router.get("/blog/{slug}", response_model=BlogPostDetailOut)
def get_blog_post(slug: str, db: Session = Depends(get_db)):
    post = (
        db.query(BlogPost)
        .filter(BlogPost.slug == slug, BlogPost.is_published.is_(True))
        .first()
    )
    if post is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Blog post not found")
    return post
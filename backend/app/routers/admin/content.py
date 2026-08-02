from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.crud_factory import build_crud_router
from app.core.database import get_db
from app.core.deps import get_current_admin
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
from app.schemas.admin_content import (
    BatchAdminOut,
    BatchCreate,
    BatchUpdate,
    BlogPostAdminOut,
    BlogPostCreate,
    BlogPostUpdate,
    FacultyMemberAdminOut,
    FacultyMemberCreate,
    FacultyMemberUpdate,
    FAQItemAdminOut,
    FAQItemCreate,
    FAQItemUpdate,
    FeePlanAdminOut,
    FeePlanCreate,
    FeePlanUpdate,
    GalleryItemAdminOut,
    GalleryItemCreate,
    GalleryItemUpdate,
    LiveClassAdminOut,
    LiveClassCreate,
    LiveClassUpdate,
    ResultHighlightAdminOut,
    ResultHighlightCreate,
    ResultHighlightUpdate,
    SiteSettingsAdminOut,
    SiteSettingsUpdate,
    StatItemAdminOut,
    StatItemCreate,
    StatItemUpdate,
    TestimonialAdminOut,
    TestimonialCreate,
    TestimonialUpdate,
    WhyPointAdminOut,
    WhyPointCreate,
    WhyPointUpdate,
)

router = APIRouter(prefix="/admin", tags=["admin:content"])

# ---- Simple list-type content: generated via the CRUD factory ----
router.include_router(
    build_crud_router(
        model=StatItem, create_schema=StatItemCreate, update_schema=StatItemUpdate,
        out_schema=StatItemAdminOut, prefix="/stats", tag="admin:stats",
    )
)
router.include_router(
    build_crud_router(
        model=WhyPoint, create_schema=WhyPointCreate, update_schema=WhyPointUpdate,
        out_schema=WhyPointAdminOut, prefix="/why-points", tag="admin:why-points",
    )
)
router.include_router(
    build_crud_router(
        model=Batch, create_schema=BatchCreate, update_schema=BatchUpdate,
        out_schema=BatchAdminOut, prefix="/batches", tag="admin:batches",
    )
)
router.include_router(
    build_crud_router(
        model=FacultyMember, create_schema=FacultyMemberCreate, update_schema=FacultyMemberUpdate,
        out_schema=FacultyMemberAdminOut, prefix="/faculty", tag="admin:faculty",
    )
)
router.include_router(
    build_crud_router(
        model=ResultHighlight, create_schema=ResultHighlightCreate, update_schema=ResultHighlightUpdate,
        out_schema=ResultHighlightAdminOut, prefix="/results", tag="admin:results",
    )
)
router.include_router(
    build_crud_router(
        model=Testimonial, create_schema=TestimonialCreate, update_schema=TestimonialUpdate,
        out_schema=TestimonialAdminOut, prefix="/testimonials", tag="admin:testimonials",
    )
)
router.include_router(
    build_crud_router(
        model=GalleryItem, create_schema=GalleryItemCreate, update_schema=GalleryItemUpdate,
        out_schema=GalleryItemAdminOut, prefix="/gallery", tag="admin:gallery",
    )
)
router.include_router(
    build_crud_router(
        model=FAQItem, create_schema=FAQItemCreate, update_schema=FAQItemUpdate,
        out_schema=FAQItemAdminOut, prefix="/faqs", tag="admin:faqs",
    )
)
router.include_router(
    build_crud_router(
        model=FeePlan, create_schema=FeePlanCreate, update_schema=FeePlanUpdate,
        out_schema=FeePlanAdminOut, prefix="/fee-plans", tag="admin:fee-plans",
    )
)
router.include_router(
    build_crud_router(
        model=BlogPost, create_schema=BlogPostCreate, update_schema=BlogPostUpdate,
        out_schema=BlogPostAdminOut, prefix="/blog", tag="admin:blog",
        order_by_field="created_at",
    )
)
router.include_router(
    build_crud_router(
        model=LiveClass, create_schema=LiveClassCreate, update_schema=LiveClassUpdate,
        out_schema=LiveClassAdminOut, prefix="/live-classes", tag="admin:live-classes",
        order_by_field="scheduled_at",
    )
)


# ---- SiteSettings: singleton, custom GET/PUT (no create/delete/list) ----
@router.get("/site-settings", response_model=SiteSettingsAdminOut, tags=["admin:site-settings"])
def get_site_settings(db: Session = Depends(get_db), admin=Depends(get_current_admin)):
    settings_row = db.get(SiteSettings, 1)
    if settings_row is None:
        settings_row = SiteSettings(id=1)
        db.add(settings_row)
        db.commit()
        db.refresh(settings_row)
    return settings_row


@router.put("/site-settings", response_model=SiteSettingsAdminOut, tags=["admin:site-settings"])
def update_site_settings(
    payload: SiteSettingsUpdate,
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin),
):
    settings_row = db.get(SiteSettings, 1)
    if settings_row is None:
        settings_row = SiteSettings(id=1)
        db.add(settings_row)

    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(settings_row, field, value)

    db.commit()
    db.refresh(settings_row)
    return settings_row
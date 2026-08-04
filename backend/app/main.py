from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded

from app.core.config import settings
from app.core.limiter import limiter

app = FastAPI(
    title="Education Era Academy API",
    version="0.1.0",
    description="Backend for the Education Era Academy website: content, academics, quiz, leads, admin.",
)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from app.routers import academics, auth, contact, doubts, public, quiz
from app.routers.admin import academics as admin_academics
from app.routers.admin import content as admin_content
from app.routers.admin import doubts as admin_doubts
from app.routers.admin import leads as admin_leads
from app.routers.admin import quiz as admin_quiz

app.include_router(auth.router)
app.include_router(public.router)
app.include_router(academics.router)
app.include_router(quiz.router)
app.include_router(contact.router)
app.include_router(doubts.router)
app.include_router(admin_content.router)
app.include_router(admin_academics.router)
app.include_router(admin_quiz.router)
app.include_router(admin_leads.router)
app.include_router(admin_doubts.router)


@app.get("/health", tags=["meta"])
def health_check():
    return {"status": "ok", "env": settings.ENV}
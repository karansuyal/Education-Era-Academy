from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings

app = FastAPI(
    title="Education Era Academy API",
    version="0.1.0",
    description="Backend for the Education Era Academy website: content, academics, quiz, leads, admin.",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from app.routers import academics, auth, contact, public, quiz
from app.routers.admin import academics as admin_academics
from app.routers.admin import content as admin_content
from app.routers.admin import leads as admin_leads
from app.routers.admin import quiz as admin_quiz

app.include_router(auth.router)
app.include_router(public.router)
app.include_router(academics.router)
app.include_router(quiz.router)
app.include_router(contact.router)
app.include_router(admin_content.router)
app.include_router(admin_academics.router)
app.include_router(admin_quiz.router)
app.include_router(admin_leads.router)


@app.get("/health", tags=["meta"])
def health_check():
    return {"status": "ok", "env": settings.ENV}
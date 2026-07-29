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

from app.routers import auth

app.include_router(auth.router)

# Remaining routers are added here as they're built
# from app.routers import public, academics, quiz, contact
# app.include_router(public.router)
# app.include_router(academics.router)
# app.include_router(quiz.router)
# app.include_router(contact.router)


@app.get("/health", tags=["meta"])
def health_check():
    return {"status": "ok", "env": settings.ENV}
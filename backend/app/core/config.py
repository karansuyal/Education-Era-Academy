from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # Database
    DATABASE_URL: str = "postgresql+psycopg2://eea_user:eea_password@localhost:5432/eea_db"

    # JWT
    JWT_SECRET_KEY: str = "insecure-dev-secret-change-me"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    # First admin (used only by seed script)
    FIRST_ADMIN_USERNAME: str = "admin"
    FIRST_ADMIN_PASSWORD: str = "change-this-password"
    FIRST_ADMIN_EMAIL: str = "admin@educationera.local"

    # CORS
    CORS_ORIGINS: str = "http://localhost:5173,http://localhost:3000"

    # Environment
    ENV: str = "development"

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    @property
    def cors_origins_list(self) -> list[str]:
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",") if origin.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()

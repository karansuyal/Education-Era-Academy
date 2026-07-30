from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.crud_factory import build_crud_router
from app.core.database import get_db
from app.core.deps import get_current_admin
from app.models.quiz import Attempt, MockTest, Question
from app.schemas.admin_quiz import (
    AttemptOut,
    LeaderboardEntryOut,
    MockTestCreate,
    MockTestOut,
    MockTestUpdate,
    QuestionCreate,
    QuestionOut,
    QuestionUpdate,
)

router = APIRouter(prefix="/admin/quiz", tags=["admin:quiz"])

router.include_router(
    build_crud_router(
        model=MockTest, create_schema=MockTestCreate, update_schema=MockTestUpdate,
        out_schema=MockTestOut, prefix="/mock-tests", tag="admin:quiz:mock-tests",
        order_by_field="created_at",
    )
)
router.include_router(
    build_crud_router(
        model=Question, create_schema=QuestionCreate, update_schema=QuestionUpdate,
        out_schema=QuestionOut, prefix="/questions", tag="admin:quiz:questions",
    )
)


@router.get("/mock-tests/{mock_test_id}/attempts", response_model=list[AttemptOut])
def list_attempts(
    mock_test_id: int,
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin),
):
    return (
        db.query(Attempt)
        .filter(Attempt.mock_test_id == mock_test_id)
        .order_by(Attempt.submitted_at.desc())
        .all()
    )


@router.get("/mock-tests/{mock_test_id}/leaderboard", response_model=list[LeaderboardEntryOut])
def get_leaderboard(
    mock_test_id: int,
    limit: int = 50,
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin),
):
    """Best attempt per student phone number, ranked by score desc then
    time taken asc (faster = better on a tie). This mirrors the public
    leaderboard endpoint — kept here too so admins can preview it."""

    attempts = (
        db.query(Attempt)
        .filter(Attempt.mock_test_id == mock_test_id)
        .order_by(Attempt.score.desc(), Attempt.time_taken_seconds.asc(), Attempt.submitted_at.asc())
        .all()
    )

    best_per_phone: dict[str, Attempt] = {}
    for attempt in attempts:
        existing = best_per_phone.get(attempt.student_phone)
        if existing is None:
            best_per_phone[attempt.student_phone] = attempt
        elif (attempt.score, -attempt.time_taken_seconds) > (existing.score, -existing.time_taken_seconds):
            best_per_phone[attempt.student_phone] = attempt

    ranked = sorted(
        best_per_phone.values(),
        key=lambda a: (-a.score, a.time_taken_seconds, a.submitted_at),
    )[:limit]

    return [
        LeaderboardEntryOut(
            rank=i + 1,
            student_name=a.student_name,
            student_phone=a.student_phone,
            score=a.score,
            total_questions=a.total_questions,
            time_taken_seconds=a.time_taken_seconds,
            submitted_at=a.submitted_at,
        )
        for i, a in enumerate(ranked)
    ]

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, selectinload

from app.core.database import get_db
from app.models.quiz import Attempt, AttemptAnswer, MockTest, Question
from backend.app.schemas.admin_quiz import (
    MockTestDetailOut,
    MockTestListItemOut,
    PublicLeaderboardEntryOut,
    SubmitAttemptIn,
    SubmitAttemptOut,
)

router = APIRouter(prefix="/quiz", tags=["quiz"])


@router.get("/mock-tests", response_model=list[MockTestListItemOut])
def list_mock_tests(
    class_label: str | None = None,
    subject_label: str | None = None,
    db: Session = Depends(get_db),
):
    query = db.query(MockTest).filter(MockTest.is_active.is_(True))
    if class_label:
        query = query.filter(MockTest.class_label == class_label)
    if subject_label:
        query = query.filter(MockTest.subject_label == subject_label)
    return query.order_by(MockTest.created_at.desc()).all()


@router.get("/mock-tests/{mock_test_id}", response_model=MockTestDetailOut)
def get_mock_test(mock_test_id: int, db: Session = Depends(get_db)):
    """Returns the test with its questions and options — correct_index is
    NEVER included here (see PublicQuestionOut). Scoring happens server-side
    on submit, so there's nothing for a curious student to read out of devtools."""

    test = (
        db.query(MockTest)
        .options(selectinload(MockTest.questions))
        .filter(MockTest.id == mock_test_id, MockTest.is_active.is_(True))
        .first()
    )
    if test is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Mock test not found or inactive")
    return test


@router.post("/mock-tests/{mock_test_id}/submit", response_model=SubmitAttemptOut)
def submit_attempt(mock_test_id: int, payload: SubmitAttemptIn, db: Session = Depends(get_db)):
    test = (
        db.query(MockTest)
        .options(selectinload(MockTest.questions))
        .filter(MockTest.id == mock_test_id, MockTest.is_active.is_(True))
        .first()
    )
    if test is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Mock test not found or inactive")

    questions_by_id: dict[int, Question] = {q.id: q for q in test.questions}
    if not questions_by_id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="This test has no questions yet")

    submitted_by_qid = {a.question_id: a.selected_index for a in payload.answers}

    correct_ids: list[int] = []
    incorrect_ids: list[int] = []
    answer_rows: list[AttemptAnswer] = []

    # Score against EVERY question in the test (not just submitted ones) —
    # an unanswered question counts as incorrect, exactly like a real exam.
    for qid, question in questions_by_id.items():
        selected = submitted_by_qid.get(qid, -1)
        is_correct = selected == question.correct_index
        (correct_ids if is_correct else incorrect_ids).append(qid)
        answer_rows.append(AttemptAnswer(question_id=qid, selected_index=selected, is_correct=is_correct))

    attempt = Attempt(
        mock_test_id=test.id,
        student_name=payload.student_name.strip(),
        student_phone=payload.student_phone.strip(),
        score=len(correct_ids),
        total_questions=len(questions_by_id),
        time_taken_seconds=payload.time_taken_seconds,
        answers=answer_rows,
    )
    db.add(attempt)
    db.commit()
    db.refresh(attempt)

    return SubmitAttemptOut(
        attempt_id=attempt.id,
        score=attempt.score,
        total_questions=attempt.total_questions,
        correct_question_ids=correct_ids,
        incorrect_question_ids=incorrect_ids,
    )


@router.get("/mock-tests/{mock_test_id}/leaderboard", response_model=list[PublicLeaderboardEntryOut])
def get_public_leaderboard(mock_test_id: int, limit: int = 20, db: Session = Depends(get_db)):
    """Best attempt per phone number, ranked by score desc then time asc.
    Phone numbers are never exposed here — only name, score, and time."""

    attempts = (
        db.query(Attempt)
        .filter(Attempt.mock_test_id == mock_test_id)
        .order_by(Attempt.score.desc(), Attempt.time_taken_seconds.asc())
        .all()
    )

    best_per_phone: dict[str, Attempt] = {}
    for attempt in attempts:
        existing = best_per_phone.get(attempt.student_phone)
        if existing is None or (attempt.score, -attempt.time_taken_seconds) > (
            existing.score,
            -existing.time_taken_seconds,
        ):
            best_per_phone[attempt.student_phone] = attempt

    ranked = sorted(
        best_per_phone.values(),
        key=lambda a: (-a.score, a.time_taken_seconds, a.submitted_at),
    )[:limit]

    return [
        PublicLeaderboardEntryOut(
            rank=i + 1,
            student_name=a.student_name,
            score=a.score,
            total_questions=a.total_questions,
            time_taken_seconds=a.time_taken_seconds,
        )
        for i, a in enumerate(ranked)
    ]

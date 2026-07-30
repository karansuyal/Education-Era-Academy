import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSiteData } from '../context/SiteDataContext'
import { getMockTests, getMockTest, submitMockTestAttempt } from '../api/client'
import usePageMeta from '../utils/usePageMeta'

// Stages: 'list' -> pick a test | 'details' -> enter name/phone | 'quiz' -> answering | 'result'
export default function MockTest() {
  const { siteInfo } = useSiteData()
  usePageMeta(
    `Free Mock Test | ${siteInfo.name} ${siteInfo.nameSuffix}`,
    'Attempt a free mock test — practice questions for board exams and government exam preparation.'
  )

  const [stage, setStage] = useState('list')
  const [tests, setTests] = useState([])
  const [listLoading, setListLoading] = useState(true)
  const [listError, setListError] = useState(null)

  const [activeTest, setActiveTest] = useState(null) // full test with questions
  const [studentName, setStudentName] = useState('')
  const [studentPhone, setStudentPhone] = useState('')

  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState({}) // { [questionId]: selectedIndex }
  const [startedAt, setStartedAt] = useState(null)

  const [result, setResult] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState(null)

  useEffect(() => {
    let cancelled = false
    getMockTests()
      .then((data) => { if (!cancelled) setTests(data) })
      .catch((err) => { if (!cancelled) setListError(err) })
      .finally(() => { if (!cancelled) setListLoading(false) })
    return () => { cancelled = true }
  }, [])

  const chooseTest = async (testId) => {
    setListError(null)
    try {
      const full = await getMockTest(testId)
      setActiveTest(full)
      setStage('details')
    } catch (err) {
      setListError(err)
    }
  }

  const startTest = (e) => {
    e.preventDefault()
    setAnswers({})
    setCurrent(0)
    setStartedAt(Date.now())
    setStage('quiz')
  }

  const selectOption = (questionId, optIndex) => {
    setAnswers({ ...answers, [questionId]: optIndex })
  }

  const goNext = () => setCurrent((c) => Math.min(c + 1, activeTest.questions.length - 1))
  const goPrev = () => setCurrent((c) => Math.max(c - 1, 0))

  const submitTest = async () => {
    setSubmitting(true)
    setSubmitError(null)
    try {
      const timeTakenSeconds = Math.round((Date.now() - startedAt) / 1000)
      const payloadAnswers = activeTest.questions.map((q) => ({
        questionId: q.id,
        selectedIndex: answers[q.id] ?? -1,
      }))
      const out = await submitMockTestAttempt(activeTest.id, {
        studentName,
        studentPhone,
        timeTakenSeconds,
        answers: payloadAnswers,
      })
      setResult(out)
      setStage('result')
    } catch (err) {
      setSubmitError(err)
    } finally {
      setSubmitting(false)
    }
  }

  const restart = () => {
    setStage('list')
    setActiveTest(null)
    setAnswers({})
    setResult(null)
    setSubmitError(null)
  }

  // ---------------- LIST STAGE ----------------
  if (stage === 'list') {
    return (
      <div className="quiz-page">
        <p className="section-eyebrow">Mock Test</p>
        <h2 style={{ marginBottom: '20px' }}>Choose a test to attempt.</h2>

        {listLoading && <p>Loading available tests…</p>}
        {!listLoading && listError && (
          <p>Couldn't load mock tests right now — please try again shortly.</p>
        )}
        {!listLoading && !listError && tests.length === 0 && (
          <p>No mock tests are available yet — check back soon.</p>
        )}

        <div className="quiz-card" style={{ display: 'grid', gap: '14px' }}>
          {tests.map((t) => (
            <div key={t.id} className="batch-card" style={{ textAlign: 'left' }}>
              <div className="batch-code">{t.class_label} · {t.subject_label}</div>
              <h3>{t.title}</h3>
              <p>{t.description}</p>
              <p style={{ fontSize: '0.85rem', color: 'var(--slate)' }}>{t.duration_minutes} minutes</p>
              <button className="btn btn-primary" onClick={() => chooseTest(t.id)}>Start</button>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // ---------------- DETAILS STAGE (name/phone before starting) ----------------
  if (stage === 'details' && activeTest) {
    return (
      <div className="quiz-page">
        <div className="quiz-card">
          <h3 className="quiz-question">{activeTest.title}</h3>
          <p>{activeTest.description}</p>
          <form onSubmit={startTest} className="enquiry-form">
            <label>
              Your name
              <input
                type="text"
                required
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="e.g. Karan Suyal"
              />
            </label>
            <label>
              Phone number
              <input
                type="tel"
                required
                value={studentPhone}
                onChange={(e) => setStudentPhone(e.target.value)}
                placeholder="10-digit mobile number"
              />
            </label>
            <div className="quiz-nav">
              <button type="button" className="btn btn-outline" onClick={restart}>Back</button>
              <button type="submit" className="btn btn-primary">
                Start Test ({activeTest.questions.length} questions)
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  }

  // ---------------- RESULT STAGE ----------------
  if (stage === 'result' && result) {
    const whatsappText = encodeURIComponent(
      `Hi, I just took the "${activeTest.title}" mock test on the website and scored ${result.score}/${result.totalQuestions}. I'd like to know more about ${siteInfo.name} ${siteInfo.nameSuffix}.`
    )
    return (
      <div className="quiz-page">
        <div className="quiz-result">
          <p className="section-eyebrow">Mock Test Result</p>
          <div className="quiz-score">{result.score} / {result.totalQuestions}</div>
          <p>
            {result.score === result.totalQuestions
              ? "Perfect score — you're ready for the real thing."
              : result.score >= result.totalQuestions / 2
              ? 'Solid attempt — a few topics to sharpen up.'
              : 'Good starting point — this is exactly what our batches are for.'}
          </p>
          <div className="hero-actions" style={{ justifyContent: 'center', marginTop: '24px' }}>
            <button className="btn btn-primary" onClick={restart}>Take Another Test</button>
            <a
              className="btn btn-outline"
              href={`https://wa.me/${siteInfo.whatsappNumber}?text=${whatsappText}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Share Score &amp; Enquire
            </a>
          </div>
        </div>

        <div className="quiz-card" style={{ marginTop: '24px' }}>
          <h3 className="quiz-question">Review</h3>
          <div className="quiz-options">
            {activeTest.questions.map((q, i) => {
              const correct = result.correctQuestionIds.includes(q.id)
              return (
                <div key={q.id} className={`quiz-option ${correct ? 'correct' : 'incorrect'}`}>
                  Q{i + 1}. {q.question_text} — {correct ? 'Correct' : 'Incorrect'}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  // ---------------- QUIZ STAGE ----------------
  if (stage === 'quiz' && activeTest) {
    const question = activeTest.questions[current]
    const total = activeTest.questions.length
    const isLast = current + 1 === total

    return (
      <div className="quiz-page">
        <p className="quiz-progress">Question {current + 1} of {total}</p>
        <div className="quiz-card">
          <h3 className="quiz-question">{question.question_text}</h3>
          <div className="quiz-options">
            {question.options.map((opt, i) => (
              <button
                key={i}
                className={`quiz-option ${answers[question.id] === i ? 'selected' : ''}`}
                onClick={() => selectOption(question.id, i)}
              >
                {opt}
              </button>
            ))}
          </div>

          {submitError && <p>Couldn't submit your test — please check your connection and try again.</p>}

          <div className="quiz-nav">
            <Link to="/" className="btn btn-outline">Exit</Link>
            {current > 0 && (
              <button className="btn btn-outline" onClick={goPrev}>Previous</button>
            )}
            {!isLast && (
              <button
                className="btn btn-primary"
                onClick={goNext}
                disabled={answers[question.id] === undefined}
              >
                Next Question
              </button>
            )}
            {isLast && (
              <button
                className="btn btn-primary"
                onClick={submitTest}
                disabled={answers[question.id] === undefined || submitting}
              >
                {submitting ? 'Submitting…' : 'Submit Test'}
              </button>
            )}
          </div>
        </div>
      </div>
    )
  }

  return null
}

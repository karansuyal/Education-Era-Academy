import { useState } from 'react'
import { Link } from 'react-router-dom'
import { quizQuestions, siteInfo } from '../data/content'

export default function MockTest() {
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState({})
  const [showAnswer, setShowAnswer] = useState(false)
  const [finished, setFinished] = useState(false)

  const question = quizQuestions[current]
  const total = quizQuestions.length

  const selectOption = (optIndex) => {
    if (showAnswer) return
    setAnswers({ ...answers, [question.id]: optIndex })
    setShowAnswer(true)
  }

  const goNext = () => {
    setShowAnswer(false)
    if (current + 1 < total) {
      setCurrent(current + 1)
    } else {
      setFinished(true)
    }
  }

  const restart = () => {
    setCurrent(0)
    setAnswers({})
    setShowAnswer(false)
    setFinished(false)
  }

  const score = quizQuestions.reduce(
    (acc, q) => acc + (answers[q.id] === q.correctIndex ? 1 : 0),
    0
  )

  if (finished) {
    const whatsappText = encodeURIComponent(
      `Hi, I just took the free mock test on the website and scored ${score}/${total}. I'd like to know more about ${siteInfo.name} ${siteInfo.nameSuffix}.`
    )
    return (
      <div className="quiz-page">
        <div className="quiz-result">
          <p className="section-eyebrow">Mock Test Result</p>
          <div className="quiz-score">{score} / {total}</div>
          <p>
            {score === total
              ? "Perfect score — you're ready for the real thing."
              : score >= total / 2
              ? "Solid attempt — a few topics to sharpen up."
              : "Good starting point — this is exactly what our batches are for."}
          </p>
          <div className="hero-actions" style={{ justifyContent: 'center', marginTop: '24px' }}>
            <button className="btn btn-primary" onClick={restart}>Retake Test</button>
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
      </div>
    )
  }

  return (
    <div className="quiz-page">
      <p className="quiz-progress">Question {current + 1} of {total}</p>
      <div className="quiz-card">
        <h3 className="quiz-question">{question.question}</h3>
        <div className="quiz-options">
          {question.options.map((opt, i) => {
            let cls = 'quiz-option'
            if (showAnswer) {
              if (i === question.correctIndex) cls += ' correct'
              else if (i === answers[question.id]) cls += ' incorrect'
            } else if (answers[question.id] === i) {
              cls += ' selected'
            }
            return (
              <button key={i} className={cls} onClick={() => selectOption(i)}>
                {opt}
              </button>
            )
          })}
        </div>
        <div className="quiz-nav">
          <Link to="/" className="btn btn-outline">Exit</Link>
          <button className="btn btn-primary" onClick={goNext} disabled={!showAnswer}>
            {current + 1 === total ? 'See Result' : 'Next Question'}
          </button>
        </div>
      </div>
      {/* EDIT ME: replace quizQuestions in data/content.js with real
          subject-wise questions. You can also add a batch selector here
          and keep separate question sets per batch if needed. */}
    </div>
  )
}

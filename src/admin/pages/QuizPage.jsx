import { useEffect, useState } from 'react'
import { adminGet, adminPost, adminPut, adminDelete } from '../adminApi'

function MockTestForm({ initial, onCancel, onSave }) {
  const [values, setValues] = useState(() => ({
    title: '', description: '', class_label: '', subject_label: '', is_active: true, duration_minutes: 0,
    ...initial,
  }))
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      await onSave(values)
    } catch (err) {
      setError(err.message)
      setSaving(false)
    }
  }

  return (
    <form className="admin-card" onSubmit={handleSubmit}>
      {error && <div className="admin-error-banner">{error}</div>}
      <div className="admin-form-grid">
        <div className="admin-form-field span-2">
          <label>Title</label>
          <input value={values.title} onChange={(e) => setValues((v) => ({ ...v, title: e.target.value }))} required />
        </div>
        <div className="admin-form-field span-2">
          <label>Description</label>
          <textarea value={values.description} onChange={(e) => setValues((v) => ({ ...v, description: e.target.value }))} />
        </div>
        <div className="admin-form-field">
          <label>Class label</label>
          <input value={values.class_label} placeholder="e.g. Class 10" onChange={(e) => setValues((v) => ({ ...v, class_label: e.target.value }))} />
        </div>
        <div className="admin-form-field">
          <label>Subject label</label>
          <input value={values.subject_label} placeholder="e.g. Mathematics" onChange={(e) => setValues((v) => ({ ...v, subject_label: e.target.value }))} />
        </div>
        <div className="admin-form-field">
          <label>Duration (minutes, 0 = untimed)</label>
          <input type="number" value={values.duration_minutes} onChange={(e) => setValues((v) => ({ ...v, duration_minutes: Number(e.target.value) }))} />
        </div>
        <div className="admin-form-field">
          <label>Active</label>
          <div className="admin-checkbox-row">
            <input type="checkbox" checked={values.is_active} onChange={(e) => setValues((v) => ({ ...v, is_active: e.target.checked }))} />
          </div>
        </div>
      </div>
      <div className="admin-form-actions">
        <button className="admin-btn admin-btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
        <button type="button" className="admin-btn admin-btn-ghost" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  )
}

function QuestionForm({ initial, onCancel, onSave }) {
  const [questionText, setQuestionText] = useState(initial?.question_text || '')
  const [optionsText, setOptionsText] = useState((initial?.options || ['', '', '', '']).join('\n'))
  const [correctIndex, setCorrectIndex] = useState(initial?.correct_index ?? 0)
  const [orderIndex, setOrderIndex] = useState(initial?.order_index ?? 0)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  const options = optionsText.split('\n').map((s) => s.trim()).filter(Boolean)

  async function handleSubmit(e) {
    e.preventDefault()
    if (options.length < 2) {
      setError('Add at least 2 options (one per line).')
      return
    }
    if (correctIndex >= options.length) {
      setError('Correct answer must point to one of the options below.')
      return
    }
    setSaving(true)
    setError(null)
    try {
      await onSave({ question_text: questionText, options, correct_index: Number(correctIndex), order_index: Number(orderIndex) })
    } catch (err) {
      setError(err.message)
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: 16, padding: 14, background: '#FAF8F2', borderRadius: 6 }}>
      {error && <div className="admin-error-banner">{error}</div>}
      <div className="admin-form-field span-2" style={{ marginBottom: 10 }}>
        <label>Question text</label>
        <textarea value={questionText} onChange={(e) => setQuestionText(e.target.value)} required />
      </div>
      <div className="admin-form-field span-2" style={{ marginBottom: 10 }}>
        <label>Options — one per line</label>
        <textarea value={optionsText} onChange={(e) => setOptionsText(e.target.value)} style={{ minHeight: 110 }} />
      </div>
      <div className="admin-form-grid" style={{ marginBottom: 4 }}>
        <div className="admin-form-field">
          <label>Correct answer</label>
          <select value={correctIndex} onChange={(e) => setCorrectIndex(Number(e.target.value))}>
            {options.length === 0 && <option value={0}>— add options above —</option>}
            {options.map((opt, i) => (
              <option key={i} value={i}>{opt || `Option ${i + 1}`}</option>
            ))}
          </select>
        </div>
        <div className="admin-form-field">
          <label>Order</label>
          <input type="number" value={orderIndex} onChange={(e) => setOrderIndex(e.target.value)} />
        </div>
      </div>
      <div className="admin-form-actions">
        <button className="admin-btn admin-btn-primary admin-btn-small" disabled={saving}>{saving ? 'Saving…' : 'Save question'}</button>
        <button type="button" className="admin-btn admin-btn-ghost admin-btn-small" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  )
}

export default function QuizPage() {
  const [tests, setTests] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [editingTest, setEditingTest] = useState(undefined)
  const [selectedTestId, setSelectedTestId] = useState(null)

  const [questions, setQuestions] = useState([])
  const [questionsLoading, setQuestionsLoading] = useState(false)
  const [editingQuestion, setEditingQuestion] = useState(undefined)

  const [leaderboard, setLeaderboard] = useState(null)
  const [showLeaderboard, setShowLeaderboard] = useState(false)

  function loadTests() {
    setLoading(true)
    adminGet('/admin/quiz/mock-tests')
      .then(setTests)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }

  useEffect(loadTests, [])

  function loadQuestions(testId) {
    setQuestionsLoading(true)
    adminGet('/admin/quiz/questions')
      .then((all) => setQuestions(all.filter((q) => q.mock_test_id === testId)))
      .catch((err) => setError(err.message))
      .finally(() => setQuestionsLoading(false))
  }

  useEffect(() => {
    if (selectedTestId) {
      loadQuestions(selectedTestId)
      setShowLeaderboard(false)
      setLeaderboard(null)
    }
  }, [selectedTestId])

  async function loadLeaderboard() {
    setShowLeaderboard(true)
    try {
      const data = await adminGet(`/admin/quiz/mock-tests/${selectedTestId}/leaderboard`)
      setLeaderboard(data)
    } catch (err) {
      setError(err.message)
    }
  }

  const selectedTest = tests.find((t) => t.id === selectedTestId)

  return (
    <div>
      <h1 className="admin-page-title">Mock Tests</h1>
      <p className="admin-page-desc">Create tests, manage questions, and check the leaderboard.</p>

      <div className="admin-toolbar">
        <button className="admin-btn admin-btn-primary" onClick={() => setEditingTest(null)}>+ Add mock test</button>
      </div>

      {editingTest !== undefined && (
        <MockTestForm
          initial={editingTest}
          onCancel={() => setEditingTest(undefined)}
          onSave={async (values) => {
            if (editingTest) await adminPut(`/admin/quiz/mock-tests/${editingTest.id}`, values)
            else await adminPost('/admin/quiz/mock-tests', values)
            setEditingTest(undefined)
            loadTests()
          }}
        />
      )}

      <div className="admin-card" style={{ padding: 0, overflowX: 'auto' }}>
        {loading ? (
          <div className="admin-empty-state">Loading…</div>
        ) : error ? (
          <div className="admin-error-banner" style={{ margin: 16 }}>{error}</div>
        ) : tests.length === 0 ? (
          <div className="admin-empty-state">No mock tests yet.</div>
        ) : (
          <table className="admin-table">
            <thead><tr><th>Title</th><th>Class</th><th>Subject</th><th>Active</th><th>Duration</th><th></th></tr></thead>
            <tbody>
              {tests.map((t) => (
                <tr key={t.id} style={t.id === selectedTestId ? { background: '#FDF3D9' } : undefined}>
                  <td>
                    <button className="admin-btn admin-btn-ghost admin-btn-small" onClick={() => setSelectedTestId(t.id)}>{t.title}</button>
                  </td>
                  <td>{t.class_label || '—'}</td>
                  <td>{t.subject_label || '—'}</td>
                  <td><span className={`admin-tag${t.is_active ? ' yes' : ''}`}>{t.is_active ? 'Active' : 'Inactive'}</span></td>
                  <td>{t.duration_minutes ? `${t.duration_minutes} min` : 'Untimed'}</td>
                  <td className="admin-table-actions">
                    <button className="admin-btn admin-btn-ghost admin-btn-small" onClick={() => setEditingTest(t)}>Edit</button>
                    <button
                      className="admin-btn admin-btn-danger admin-btn-small"
                      onClick={async () => {
                        if (!confirm('Delete this test and all its questions/attempts?')) return
                        await adminDelete(`/admin/quiz/mock-tests/${t.id}`)
                        if (selectedTestId === t.id) setSelectedTestId(null)
                        loadTests()
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {selectedTest && (
        <div className="admin-card">
          <div className="admin-toolbar">
            <h3 style={{ margin: 0 }}>Questions — {selectedTest.title}</h3>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="admin-btn admin-btn-ghost admin-btn-small" onClick={loadLeaderboard}>View leaderboard</button>
              <button className="admin-btn admin-btn-primary admin-btn-small" onClick={() => setEditingQuestion(null)}>+ Add question</button>
            </div>
          </div>

          {editingQuestion !== undefined && (
            <QuestionForm
              initial={editingQuestion}
              onCancel={() => setEditingQuestion(undefined)}
              onSave={async (values) => {
                const payload = { ...values, mock_test_id: selectedTestId }
                if (editingQuestion) await adminPut(`/admin/quiz/questions/${editingQuestion.id}`, payload)
                else await adminPost('/admin/quiz/questions', payload)
                setEditingQuestion(undefined)
                loadQuestions(selectedTestId)
              }}
            />
          )}

          {questionsLoading ? (
            <div className="admin-empty-state">Loading…</div>
          ) : questions.length === 0 ? (
            <div className="admin-empty-state">No questions yet — add the first one above.</div>
          ) : (
            <table className="admin-table">
              <thead><tr><th>Question</th><th>Options</th><th>Correct</th><th></th></tr></thead>
              <tbody>
                {questions.sort((a, b) => a.order_index - b.order_index).map((q) => (
                  <tr key={q.id}>
                    <td style={{ maxWidth: 260 }}>{q.question_text}</td>
                    <td>{q.options.join(', ')}</td>
                    <td>{q.options[q.correct_index]}</td>
                    <td className="admin-table-actions">
                      <button className="admin-btn admin-btn-ghost admin-btn-small" onClick={() => setEditingQuestion(q)}>Edit</button>
                      <button
                        className="admin-btn admin-btn-danger admin-btn-small"
                        onClick={async () => {
                          if (!confirm('Delete this question?')) return
                          await adminDelete(`/admin/quiz/questions/${q.id}`)
                          loadQuestions(selectedTestId)
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {showLeaderboard && (
            <div style={{ marginTop: 18 }}>
              <h4>Leaderboard</h4>
              {leaderboard === null ? (
                <div className="admin-empty-state">Loading…</div>
              ) : leaderboard.length === 0 ? (
                <div className="admin-empty-state">No attempts yet.</div>
              ) : (
                <table className="admin-table">
                  <thead><tr><th>Rank</th><th>Student</th><th>Phone</th><th>Score</th><th>Time</th></tr></thead>
                  <tbody>
                    {leaderboard.map((row) => (
                      <tr key={row.rank}>
                        <td>{row.rank}</td>
                        <td>{row.student_name}</td>
                        <td>{row.student_phone}</td>
                        <td>{row.score} / {row.total_questions}</td>
                        <td>{row.time_taken_seconds}s</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

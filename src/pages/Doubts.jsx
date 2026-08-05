import { useEffect, useMemo, useState } from 'react'
import { useSiteData } from '../context/SiteDataContext'
import { getAcademics, getDoubts, normalizeDoubt, submitDoubt, wsUrl } from '../api/client'
import usePageMeta from '../utils/usePageMeta'
import useLiveSocket from '../utils/useLiveSocket'

const IDENTITY_KEY = 'eea_doubt_identity'

function loadSavedIdentity() {
  try {
    const raw = localStorage.getItem(IDENTITY_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (parsed?.name && parsed?.phone) return parsed
    return null
  } catch {
    return null
  }
}

function saveIdentity(name, phone) {
  try {
    localStorage.setItem(IDENTITY_KEY, JSON.stringify({ name, phone }))
  } catch {
    // ignore storage errors (e.g. private mode)
  }
}

function timeAgo(isoString) {
  const diffMs = Date.now() - new Date(isoString).getTime()
  const mins = Math.floor(diffMs / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d ago`
  return new Date(isoString).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
}

export default function Doubts() {
  const { siteInfo } = useSiteData()
  usePageMeta(
    `Ask a Doubt — Class 9 to 12 & Govt Exam | ${siteInfo.name}`,
    'Post your subject doubt and get it answered by our teachers. See doubts every student has asked, and every answer.'
  )

  const [classesData, setClassesData] = useState([])
  const [treeLoading, setTreeLoading] = useState(true)
  const [treeError, setTreeError] = useState(null)

  // Which chapter the "ask" form is currently targeting.
  const [askClassId, setAskClassId] = useState(null)
  const [askSubjectId, setAskSubjectId] = useState(null)
  const [askChapterId, setAskChapterId] = useState(null)

  const savedIdentity = loadSavedIdentity()
  const [form, setForm] = useState({
    name: savedIdentity?.name || '',
    phone: savedIdentity?.phone || '',
    question: '',
    imageUrl: '',
  })
  const [identityKnown, setIdentityKnown] = useState(!!savedIdentity)
  const [submitting, setSubmitting] = useState(false)
  const [submitMsg, setSubmitMsg] = useState('')

  // The feed — every doubt from every class, newest first.
  const [doubts, setDoubts] = useState([])
  const [feedLoading, setFeedLoading] = useState(true)
  const [classFilter, setClassFilter] = useState('all')

  useEffect(() => {
    let cancelled = false
    getAcademics()
      .then((data) => {
        if (cancelled) return
        setClassesData(data)
        const firstClass = data[0]
        const firstSubject = firstClass?.subjects[0]
        const firstChapter = firstSubject?.chapters[0]
        setAskClassId(firstClass?.id ?? null)
        setAskSubjectId(firstSubject?.id ?? null)
        setAskChapterId(firstChapter?.id ?? null)
      })
      .catch((err) => { if (!cancelled) setTreeError(err) })
      .finally(() => { if (!cancelled) setTreeLoading(false) })
    return () => { cancelled = true }
  }, [])

  function loadFeed() {
    setFeedLoading(true)
    getDoubts()
      .then(setDoubts)
      .catch(() => setDoubts([]))
      .finally(() => setFeedLoading(false))
  }

  useEffect(loadFeed, [])

  // Live updates: new doubts, new replies, and deletions land here in
  // real time so the feed never needs a manual reload.
  useLiveSocket(wsUrl('/doubts/ws'), (msg) => {
    if (msg.type === 'new_doubt') {
      const incoming = normalizeDoubt(msg.doubt)
      setDoubts((prev) => (prev.some((d) => d.id === incoming.id) ? prev : [incoming, ...prev]))
    } else if (msg.type === 'doubt_updated') {
      const incoming = normalizeDoubt(msg.doubt)
      setDoubts((prev) => prev.map((d) => (d.id === incoming.id ? incoming : d)))
    } else if (msg.type === 'doubt_deleted') {
      setDoubts((prev) => prev.filter((d) => d.id !== msg.doubt_id))
    }
  })

  const askClass = classesData.find((c) => c.id === askClassId) || classesData[0]
  const askSubject = askClass?.subjects.find((s) => s.id === askSubjectId) || askClass?.subjects[0]
  const askChapter = askSubject?.chapters.find((c) => c.id === askChapterId) || askSubject?.chapters[0]

  const handleAskClassChange = (e) => {
    const cls = classesData.find((c) => c.id === Number(e.target.value))
    setAskClassId(cls?.id ?? null)
    setAskSubjectId(cls?.subjects[0]?.id ?? null)
    setAskChapterId(cls?.subjects[0]?.chapters[0]?.id ?? null)
  }

  const handleAskSubjectChange = (e) => {
    const sub = askClass?.subjects.find((s) => s.id === Number(e.target.value))
    setAskSubjectId(sub?.id ?? null)
    setAskChapterId(sub?.chapters[0]?.id ?? null)
  }

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!askChapter) return
    setSubmitting(true)
    setSubmitMsg('')
    try {
      await submitDoubt({
        chapterId: askChapter.id,
        studentName: form.name,
        studentPhone: form.phone,
        questionText: form.question,
        imageUrl: form.imageUrl,
      })
      saveIdentity(form.name, form.phone)
      setIdentityKnown(true)
      setForm((f) => ({ ...f, question: '', imageUrl: '' }))
      setSubmitMsg("Posted! Your doubt is now visible below — a teacher will reply soon.")
      loadFeed()
    } catch (err) {
      setSubmitMsg(err.message || 'Could not post your doubt. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const visibleDoubts = useMemo(() => {
    if (classFilter === 'all') return doubts
    return doubts.filter((d) => d.classLabel === classFilter)
  }, [doubts, classFilter])

  const classOptions = useMemo(() => {
    const seen = new Set()
    const list = []
    for (const d of doubts) {
      if (!seen.has(d.classLabel)) { seen.add(d.classLabel); list.push(d.classLabel) }
    }
    return list
  }, [doubts])

  return (
    <section className="section-pad bg-chalk" style={{ minHeight: '60vh' }}>
      <div className="wrap">
        <p className="section-eyebrow">Doubt Solving</p>
        <h2>Ask a doubt, get it answered.</h2>
        <p className="hero-sub" style={{ color: 'var(--slate)', marginBottom: 28 }}>
          Everyone's doubts and answers show up below — like a class group chat.
          Ask yours, or see what your classmates already asked.
        </p>

        {/* ---- Ask composer ---- */}
        <div className="doubt-composer">
          {treeLoading ? (
            <p style={{ margin: 0 }}>Loading chapters…</p>
          ) : treeError || classesData.length === 0 ? (
            <p style={{ margin: 0 }}>Couldn't load chapters right now — please check back shortly.</p>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="doubt-composer-row">
                <label className="admin-form-field" style={{ flex: 1 }}>
                  <span className="doubt-field-label">Class</span>
                  <select value={askClassId ?? ''} onChange={handleAskClassChange}>
                    {classesData.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
                  </select>
                </label>
                <label className="admin-form-field" style={{ flex: 1 }}>
                  <span className="doubt-field-label">Subject</span>
                  <select value={askSubjectId ?? ''} onChange={handleAskSubjectChange}>
                    {askClass?.subjects.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </label>
                <label className="admin-form-field" style={{ flex: 1 }}>
                  <span className="doubt-field-label">Chapter</span>
                  <select value={askChapterId ?? ''} onChange={(e) => setAskChapterId(Number(e.target.value))}>
                    {askSubject?.chapters.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
                  </select>
                </label>
              </div>

              <textarea
                name="question"
                required
                rows="2"
                className="doubt-composer-textarea"
                placeholder={`Type your question about "${askChapter?.title || 'this chapter'}"…`}
                value={form.question}
                onChange={handleChange}
              />

              {identityKnown ? (
                <div className="doubt-composer-row">
                  <input
                    type="url" name="imageUrl" placeholder="Photo link (optional)"
                    value={form.imageUrl} onChange={handleChange}
                  />
                  <button type="submit" className="btn btn-primary" disabled={submitting}>
                    {submitting ? 'Posting…' : 'Post doubt'}
                  </button>
                </div>
              ) : (
                <div className="doubt-composer-row">
                  <input
                    type="text" name="name" required placeholder="Your name"
                    value={form.name} onChange={handleChange}
                  />
                  <input
                    type="tel" name="phone" required placeholder="Phone number"
                    value={form.phone} onChange={handleChange}
                  />
                  <input
                    type="url" name="imageUrl" placeholder="Photo link (optional)"
                    value={form.imageUrl} onChange={handleChange}
                  />
                  <button type="submit" className="btn btn-primary" disabled={submitting}>
                    {submitting ? 'Posting…' : 'Post doubt'}
                  </button>
                </div>
              )}

              {identityKnown && (
                <p className="form-note" style={{ textAlign: 'left', marginTop: 6 }}>
                  Posting as <strong>{form.name}</strong> ·{' '}
                  <button
                    type="button"
                    onClick={() => setIdentityKnown(false)}
                    style={{ background: 'none', border: 'none', padding: 0, color: 'var(--ink)', textDecoration: 'underline', cursor: 'pointer', font: 'inherit' }}
                  >
                    Not you?
                  </button>
                </p>
              )}

              {submitMsg && <p className="form-note" style={{ textAlign: 'left' }}>{submitMsg}</p>}
            </form>
          )}
        </div>

        {/* ---- Feed header + filter ---- */}
        <div className="doubt-feed-header">
          <h3 style={{ margin: 0 }}>Recent doubts</h3>
          {classOptions.length > 1 && (
            <select
              className="doubt-filter-select"
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value)}
            >
              <option value="all">All classes</option>
              {classOptions.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          )}
        </div>

        {/* ---- Feed ---- */}
        {feedLoading ? (
          <p>Loading doubts…</p>
        ) : visibleDoubts.length === 0 ? (
          <div className="notes-panel">
            <p style={{ margin: 0 }}>No doubts posted yet. Be the first to ask!</p>
          </div>
        ) : (
          <div className="doubt-feed">
            {visibleDoubts.map((d) => (
              <div className="doubt-thread" key={d.id}>
                <div className="doubt-thread-head">
                  <div className="doubt-avatar">{d.studentName.trim().charAt(0).toUpperCase() || '?'}</div>
                  <div className="doubt-thread-meta">
                    <div className="doubt-thread-name-row">
                      <strong>{d.studentName}</strong>
                      <span className="doubt-context-tag">{d.classLabel}</span>
                    </div>
                    <span className="doubt-time">{timeAgo(d.createdAt)}</span>
                  </div>
                  <span className={`doubt-status ${d.status === 'answered' ? 'answered' : ''}`}>
                    {d.status === 'answered' ? 'Answered' : 'Pending'}
                  </span>
                </div>

                <div className="chat-bubble chat-bubble-student">{d.questionText}</div>
                {d.imageUrl && <img className="doubt-image" src={d.imageUrl} alt="Doubt attachment" />}

                {d.replies.length > 0 ? (
                  d.replies.map((r) => (
                    <div className="chat-bubble chat-bubble-teacher" key={r.id}>
                      <span className="chat-bubble-label">Teacher</span>
                      {r.replyText}
                    </div>
                  ))
                ) : (
                  <p className="doubt-waiting">Waiting for a teacher's reply…</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

import { useEffect, useState } from 'react'
import { useSiteData } from '../context/SiteDataContext'
import { getAcademics, getDoubts, submitDoubt } from '../api/client'
import usePageMeta from '../utils/usePageMeta'

export default function Doubts() {
  const { siteInfo } = useSiteData()
  usePageMeta(
    `Ask a Doubt — Class 9 to 12 & Govt Exam | ${siteInfo.name}`,
    'Post your subject doubt chapter-wise and get it answered by our teachers. Browse doubts other students already asked.'
  )

  const [classesData, setClassesData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [classId, setClassId] = useState(null)
  const [subjectId, setSubjectId] = useState(null)
  const [chapterId, setChapterId] = useState(null)

  const [doubts, setDoubts] = useState([])
  const [doubtsLoading, setDoubtsLoading] = useState(false)

  const [form, setForm] = useState({ name: '', phone: '', question: '', imageUrl: '' })
  const [submitting, setSubmitting] = useState(false)
  const [submitMsg, setSubmitMsg] = useState('')

  // Load the class -> subject -> chapter tree, same source as the Notes page.
  useEffect(() => {
    let cancelled = false
    getAcademics()
      .then((data) => {
        if (cancelled) return
        setClassesData(data)
        const firstClass = data[0]
        const firstSubject = firstClass?.subjects[0]
        const firstChapter = firstSubject?.chapters[0]
        setClassId(firstClass?.id ?? null)
        setSubjectId(firstSubject?.id ?? null)
        setChapterId(firstChapter?.id ?? null)
      })
      .catch((err) => { if (!cancelled) setError(err) })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [])

  // Re-fetch doubts whenever the selected chapter changes.
  useEffect(() => {
    if (!chapterId) return
    let cancelled = false
    setDoubtsLoading(true)
    getDoubts(chapterId)
      .then((list) => { if (!cancelled) setDoubts(list) })
      .catch(() => { if (!cancelled) setDoubts([]) })
      .finally(() => { if (!cancelled) setDoubtsLoading(false) })
    return () => { cancelled = true }
  }, [chapterId])

  const activeClass = classesData.find((c) => c.id === classId) || classesData[0]
  const activeSubject = activeClass?.subjects.find((s) => s.id === subjectId) || activeClass?.subjects[0]
  const activeChapter = activeSubject?.chapters.find((c) => c.id === chapterId) || activeSubject?.chapters[0]

  const handleClassChange = (cls) => {
    setClassId(cls.id)
    const firstSubject = cls.subjects[0]
    setSubjectId(firstSubject?.id ?? null)
    setChapterId(firstSubject?.chapters[0]?.id ?? null)
  }

  const handleSubjectChange = (sub) => {
    setSubjectId(sub.id)
    setChapterId(sub.chapters[0]?.id ?? null)
  }

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!activeChapter) return
    setSubmitting(true)
    setSubmitMsg('')
    try {
      await submitDoubt({
        chapterId: activeChapter.id,
        studentName: form.name,
        studentPhone: form.phone,
        questionText: form.question,
        imageUrl: form.imageUrl,
      })
      setForm({ name: '', phone: '', question: '', imageUrl: '' })
      setSubmitMsg("Posted! A teacher will reply here soon.")
      // Refresh the list so the new doubt shows up immediately.
      const list = await getDoubts(activeChapter.id)
      setDoubts(list)
    } catch (err) {
      setSubmitMsg(err.message || 'Could not post your doubt. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <section className="section-pad bg-chalk" style={{ minHeight: '60vh' }}>
        <div className="wrap">
          <p className="section-eyebrow">Doubt Solving</p>
          <h2>Ask a doubt.</h2>
          <p>Loading…</p>
        </div>
      </section>
    )
  }

  if (error || classesData.length === 0) {
    return (
      <section className="section-pad bg-chalk" style={{ minHeight: '60vh' }}>
        <div className="wrap">
          <p className="section-eyebrow">Doubt Solving</p>
          <h2>Ask a doubt.</h2>
          <p>Couldn't load chapters right now — please check back shortly.</p>
        </div>
      </section>
    )
  }

  return (
    <section className="section-pad bg-chalk" style={{ minHeight: '60vh' }}>
      <div className="wrap">
        <p className="section-eyebrow">Doubt Solving</p>
        <h2>Ask a doubt, get it answered.</h2>
        <p className="hero-sub" style={{ color: 'var(--slate)' }}>
          Pick your chapter, post your question, and see what our teachers replied — or what other
          students already asked.
        </p>

        {/* LEVEL 1 — Class tabs */}
        <div className="notes-tabs">
          {classesData.map((cls) => (
            <button
              key={cls.id}
              className={`notes-tab ${cls.id === activeClass?.id ? 'active' : ''}`}
              onClick={() => handleClassChange(cls)}
            >
              {cls.label}
            </button>
          ))}
        </div>

        {/* LEVEL 2 — Subject tabs */}
        {activeClass && (
          <div className="notes-tabs notes-tabs-sub">
            {activeClass.subjects.map((sub) => (
              <button
                key={sub.id}
                className={`notes-tab notes-tab-sub ${sub.id === activeSubject?.id ? 'active' : ''}`}
                onClick={() => handleSubjectChange(sub)}
              >
                {sub.name}
              </button>
            ))}
          </div>
        )}

        {/* LEVEL 3 — Chapter picker */}
        {activeSubject && (
          <div className="admin-form-field" style={{ maxWidth: 360, marginBottom: 28 }}>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--slate)' }}>Chapter</label>
            <select
              value={chapterId ?? ''}
              onChange={(e) => setChapterId(Number(e.target.value))}
              style={{
                fontFamily: 'var(--font-body)', fontSize: '0.95rem', padding: '11px 12px',
                border: '1.5px solid rgba(27,58,47,0.2)', borderRadius: 4, background: '#fff', color: 'var(--ink-deep)',
              }}
            >
              {activeSubject.chapters.map((ch) => (
                <option key={ch.id} value={ch.id}>{ch.title}</option>
              ))}
            </select>
          </div>
        )}

        <div className="doubts-layout">
          {/* Ask form */}
          <form className="enquiry-form" onSubmit={handleSubmit}>
            <h3 style={{ marginTop: 0 }}>Ask about &ldquo;{activeChapter?.title}&rdquo;</h3>
            <label>
              Full name
              <input type="text" name="name" required value={form.name} onChange={handleChange} placeholder="e.g. Karan Suyal" />
            </label>
            <label>
              Phone number
              <input type="tel" name="phone" required value={form.phone} onChange={handleChange} placeholder="10-digit mobile number" />
            </label>
            <label>
              Your question
              <textarea name="question" rows="4" required value={form.question} onChange={handleChange} placeholder="Type your doubt in detail…" />
            </label>
            <label>
              Photo of the question (optional link)
              <input type="url" name="imageUrl" value={form.imageUrl} onChange={handleChange} placeholder="Paste an image link, if you have one" />
            </label>
            <button type="submit" className="btn btn-primary btn-full" disabled={submitting}>
              {submitting ? 'Posting…' : 'Post my doubt'}
            </button>
            {submitMsg && <p className="form-note">{submitMsg}</p>}
            <p className="form-note">Your phone number is only visible to our teachers, never shown publicly.</p>
          </form>

          {/* Doubt board for the selected chapter */}
          <div className="doubts-board">
            {doubtsLoading ? (
              <p>Loading doubts…</p>
            ) : doubts.length === 0 ? (
              <div className="notes-panel">
                <p style={{ margin: 0 }}>No doubts posted for this chapter yet. Be the first to ask!</p>
              </div>
            ) : (
              <div className="doubts-list">
                {doubts.map((d) => (
                  <div className="doubt-card" key={d.id}>
                    <div className="doubt-card-head">
                      <span className="doubt-student">{d.studentName}</span>
                      <span className={`doubt-status ${d.status === 'answered' ? 'answered' : ''}`}>
                        {d.status === 'answered' ? 'Answered' : 'Pending'}
                      </span>
                    </div>
                    <p className="doubt-question">{d.questionText}</p>
                    {d.imageUrl && <img className="doubt-image" src={d.imageUrl} alt="Doubt attachment" />}

                    {d.replies.length > 0 && (
                      <div className="doubt-replies">
                        {d.replies.map((r) => (
                          <div className="doubt-reply" key={r.id}>
                            <div className="doubt-reply-label">Teacher's reply</div>
                            {r.replyText}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

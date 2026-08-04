import { useEffect, useState } from 'react'
import { adminGet, adminPost, adminDelete } from '../adminApi'

export default function DoubtsPage() {
  const [doubts, setDoubts] = useState([])
  const [filter, setFilter] = useState('all') // all | pending | answered
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [replyDrafts, setReplyDrafts] = useState({}) // doubtId -> text being typed
  const [sendingId, setSendingId] = useState(null)

  function load() {
    setLoading(true)
    const qs = filter === 'all' ? '' : `?status_filter=${filter}`
    adminGet(`/admin/doubts${qs}`)
      .then(setDoubts)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }

  useEffect(load, [filter])

  async function sendReply(doubtId) {
    const text = (replyDrafts[doubtId] || '').trim()
    if (!text) return
    setSendingId(doubtId)
    try {
      await adminPost(`/admin/doubts/${doubtId}/reply`, { reply_text: text })
      setReplyDrafts({ ...replyDrafts, [doubtId]: '' })
      load()
    } catch (err) {
      alert(err.message)
    } finally {
      setSendingId(null)
    }
  }

  async function handleDelete(doubt) {
    if (!confirm(`Delete this doubt from ${doubt.student_name}?`)) return
    try {
      await adminDelete(`/admin/doubts/${doubt.id}`)
      load()
    } catch (err) {
      alert(err.message)
    }
  }

  return (
    <div>
      <h1 className="admin-page-title">Doubts</h1>
      <p className="admin-page-desc">Student doubts posted from the site, chapter-wise. Reply to mark one as answered.</p>

      <div className="admin-breadcrumb-tabs">
        {['all', 'pending', 'answered'].map((f) => (
          <button
            key={f}
            className={`admin-breadcrumb-tab${filter === f ? ' active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f === 'all' ? 'All' : f === 'pending' ? 'Pending' : 'Answered'}
          </button>
        ))}
      </div>

      <div className="admin-card">
        {loading ? (
          <div className="admin-empty-state">Loading…</div>
        ) : error ? (
          <div className="admin-error-banner">{error}</div>
        ) : doubts.length === 0 ? (
          <div className="admin-empty-state">No doubts here.</div>
        ) : (
          doubts.map((d) => (
            <div className="admin-doubt-card" key={d.id}>
              <div className="admin-doubt-head">
                <div>
                  <strong>{d.student_name}</strong>{' '}
                  <span style={{ color: 'var(--slate)', fontSize: '0.82rem' }}>({d.student_phone})</span>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--slate)', marginTop: 2 }}>
                    {d.class_label} · {d.subject_name} · {d.chapter_title}
                  </div>
                </div>
                <span className={`admin-tag${d.status === 'answered' ? ' yes' : ''}`}>
                  {d.status === 'answered' ? 'Answered' : 'Pending'}
                </span>
              </div>

              <p style={{ margin: '8px 0' }}>{d.question_text}</p>
              {d.image_url && (
                <a href={d.image_url} target="_blank" rel="noreferrer">
                  <img src={d.image_url} alt="Doubt attachment" style={{ maxWidth: 200, borderRadius: 6, marginBottom: 8 }} />
                </a>
              )}

              {d.replies.length > 0 && (
                <div className="admin-doubt-replies">
                  {d.replies.map((r) => (
                    <div className="admin-doubt-reply" key={r.id}>{r.reply_text}</div>
                  ))}
                </div>
              )}

              <div className="admin-doubt-reply-box">
                <textarea
                  rows="2"
                  placeholder="Type a reply…"
                  value={replyDrafts[d.id] || ''}
                  onChange={(e) => setReplyDrafts({ ...replyDrafts, [d.id]: e.target.value })}
                />
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    className="admin-btn admin-btn-primary admin-btn-small"
                    disabled={sendingId === d.id}
                    onClick={() => sendReply(d.id)}
                  >
                    {sendingId === d.id ? 'Sending…' : 'Reply'}
                  </button>
                  <button className="admin-btn admin-btn-danger admin-btn-small" onClick={() => handleDelete(d)}>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

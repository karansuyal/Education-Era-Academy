import { useEffect, useState } from 'react'
import { adminGet, adminPost, adminPut, adminDelete } from '../adminApi'

// ============================================================
// Class -> Subject -> Chapter -> Notes tree manager.
//
// The admin CRUD endpoints for subjects/chapters/notes return the FULL
// list (no server-side filtering), so we fetch each level's list once
// and filter client-side by the parent id — fine at this data scale.
// ============================================================

function Section({ title, children, onAdd, addLabel }) {
  return (
    <div className="admin-card">
      <div className="admin-toolbar">
        <h3 style={{ margin: 0 }}>{title}</h3>
        {onAdd && <button className="admin-btn admin-btn-primary admin-btn-small" onClick={onAdd}>{addLabel}</button>}
      </div>
      {children}
    </div>
  )
}

function SimpleForm({ fields, initial, onCancel, onSave }) {
  const [values, setValues] = useState(() => ({ ...initial }))
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
    <form onSubmit={handleSubmit} style={{ marginBottom: 16, padding: 14, background: '#FAF8F2', borderRadius: 6 }}>
      {error && <div className="admin-error-banner">{error}</div>}
      <div className="admin-form-grid">
        {fields.map((f) => (
          <div key={f.key} className={`admin-form-field${f.span2 ? ' span-2' : ''}`}>
            <label>{f.label}</label>
            <input
              type={f.type === 'number' ? 'number' : 'text'}
              value={values[f.key] ?? ''}
              placeholder={f.placeholder}
              onChange={(e) => setValues((v) => ({ ...v, [f.key]: f.type === 'number' ? Number(e.target.value) : e.target.value }))}
            />
          </div>
        ))}
      </div>
      <div className="admin-form-actions">
        <button className="admin-btn admin-btn-primary admin-btn-small" disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
        <button type="button" className="admin-btn admin-btn-ghost admin-btn-small" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  )
}

export default function AcademicsPage() {
  const [classes, setClasses] = useState([])
  const [subjects, setSubjects] = useState([])
  const [chapters, setChapters] = useState([])
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [selectedClassId, setSelectedClassId] = useState(null)
  const [selectedSubjectId, setSelectedSubjectId] = useState(null)
  const [selectedChapterId, setSelectedChapterId] = useState(null)

  const [editingClass, setEditingClass] = useState(undefined)
  const [editingSubject, setEditingSubject] = useState(undefined)
  const [editingChapter, setEditingChapter] = useState(undefined)
  const [editingNote, setEditingNote] = useState(undefined)

  function loadAll() {
    setLoading(true)
    Promise.all([
      adminGet('/admin/academics/classes'),
      adminGet('/admin/academics/subjects'),
      adminGet('/admin/academics/chapters'),
      adminGet('/admin/academics/notes'),
    ])
      .then(([cls, subs, chaps, nts]) => {
        setClasses(cls)
        setSubjects(subs)
        setChapters(chaps)
        setNotes(nts)
        if (cls.length && selectedClassId === null) setSelectedClassId(cls[0].id)
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }

  useEffect(loadAll, [])

  if (loading) return <p>Loading…</p>
  if (error) return <div className="admin-error-banner">{error}</div>

  const classSubjects = subjects.filter((s) => s.class_level_id === selectedClassId)
  const subjectChapters = chapters.filter((c) => c.subject_id === selectedSubjectId)
  const chapterNotes = notes.filter((n) => n.chapter_id === selectedChapterId)

  return (
    <div>
      <h1 className="admin-page-title">Classes &amp; Notes</h1>
      <p className="admin-page-desc">Manage the Class → Subject → Chapter → Notes tree used by the Notes page.</p>

      {/* ---- Classes ---- */}
      <Section title="Classes" onAdd={() => setEditingClass(null)} addLabel="+ Add class">
        {editingClass !== undefined && (
          <SimpleForm
            fields={[
              { key: 'label', label: 'Label', placeholder: 'e.g. Class 10' },
              { key: 'slug', label: 'Slug', placeholder: 'e.g. class-10' },
              { key: 'order_index', label: 'Order', type: 'number' },
            ]}
            initial={editingClass || { label: '', slug: '', order_index: 0 }}
            onCancel={() => setEditingClass(undefined)}
            onSave={async (values) => {
              if (editingClass) await adminPut(`/admin/academics/classes/${editingClass.id}`, values)
              else await adminPost('/admin/academics/classes', values)
              setEditingClass(undefined)
              loadAll()
            }}
          />
        )}
        <div className="admin-breadcrumb-tabs">
          {classes.map((cls) => (
            <button
              key={cls.id}
              className={`admin-breadcrumb-tab${cls.id === selectedClassId ? ' active' : ''}`}
              onClick={() => { setSelectedClassId(cls.id); setSelectedSubjectId(null); setSelectedChapterId(null) }}
            >
              {cls.label}
            </button>
          ))}
        </div>
        {selectedClassId && (
          <div className="admin-table-actions">
            <button className="admin-btn admin-btn-ghost admin-btn-small" onClick={() => setEditingClass(classes.find((c) => c.id === selectedClassId))}>Edit selected</button>
            <button
              className="admin-btn admin-btn-danger admin-btn-small"
              onClick={async () => {
                if (!confirm('Delete this class and everything under it (subjects, chapters, notes)?')) return
                await adminDelete(`/admin/academics/classes/${selectedClassId}`)
                setSelectedClassId(null)
                loadAll()
              }}
            >
              Delete selected
            </button>
          </div>
        )}
      </Section>

      {/* ---- Subjects ---- */}
      {selectedClassId && (
        <Section title="Subjects" onAdd={() => setEditingSubject(null)} addLabel="+ Add subject">
          {editingSubject !== undefined && (
            <SimpleForm
              fields={[
                { key: 'name', label: 'Name', placeholder: 'e.g. Mathematics' },
                { key: 'slug', label: 'Slug', placeholder: 'e.g. class-10-maths' },
                { key: 'youtube_id', label: 'YouTube ID (optional)' },
                { key: 'order_index', label: 'Order', type: 'number' },
              ]}
              initial={editingSubject || { name: '', slug: '', youtube_id: '', order_index: 0, class_level_id: selectedClassId }}
              onCancel={() => setEditingSubject(undefined)}
              onSave={async (values) => {
                const payload = { ...values, class_level_id: selectedClassId }
                if (editingSubject) await adminPut(`/admin/academics/subjects/${editingSubject.id}`, payload)
                else await adminPost('/admin/academics/subjects', payload)
                setEditingSubject(undefined)
                loadAll()
              }}
            />
          )}
          {classSubjects.length === 0 ? (
            <div className="admin-empty-state">No subjects yet under this class.</div>
          ) : (
            <table className="admin-table">
              <thead><tr><th>Name</th><th>Slug</th><th>Order</th><th></th></tr></thead>
              <tbody>
                {classSubjects.map((sub) => (
                  <tr key={sub.id} style={sub.id === selectedSubjectId ? { background: '#FDF3D9' } : undefined}>
                    <td>
                      <button className="admin-btn admin-btn-ghost admin-btn-small" onClick={() => { setSelectedSubjectId(sub.id); setSelectedChapterId(null) }}>
                        {sub.name}
                      </button>
                    </td>
                    <td>{sub.slug}</td>
                    <td>{sub.order_index}</td>
                    <td className="admin-table-actions">
                      <button className="admin-btn admin-btn-ghost admin-btn-small" onClick={() => setEditingSubject(sub)}>Edit</button>
                      <button
                        className="admin-btn admin-btn-danger admin-btn-small"
                        onClick={async () => {
                          if (!confirm('Delete this subject and its chapters/notes?')) return
                          await adminDelete(`/admin/academics/subjects/${sub.id}`)
                          if (selectedSubjectId === sub.id) setSelectedSubjectId(null)
                          loadAll()
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
        </Section>
      )}

      {/* ---- Chapters ---- */}
      {selectedSubjectId && (
        <Section title="Chapters" onAdd={() => setEditingChapter(null)} addLabel="+ Add chapter">
          {editingChapter !== undefined && (
            <SimpleForm
              fields={[
                { key: 'title', label: 'Title', placeholder: 'e.g. Real Numbers', span2: true },
                { key: 'youtube_id', label: 'YouTube ID (blank = "coming soon")' },
                { key: 'order_index', label: 'Order', type: 'number' },
              ]}
              initial={editingChapter || { title: '', youtube_id: '', order_index: 0, subject_id: selectedSubjectId }}
              onCancel={() => setEditingChapter(undefined)}
              onSave={async (values) => {
                const payload = { ...values, subject_id: selectedSubjectId }
                if (editingChapter) await adminPut(`/admin/academics/chapters/${editingChapter.id}`, payload)
                else await adminPost('/admin/academics/chapters', payload)
                setEditingChapter(undefined)
                loadAll()
              }}
            />
          )}
          {subjectChapters.length === 0 ? (
            <div className="admin-empty-state">No chapters yet under this subject.</div>
          ) : (
            <table className="admin-table">
              <thead><tr><th>Title</th><th>YouTube ID</th><th>Order</th><th></th></tr></thead>
              <tbody>
                {subjectChapters.map((ch) => (
                  <tr key={ch.id} style={ch.id === selectedChapterId ? { background: '#FDF3D9' } : undefined}>
                    <td>
                      <button className="admin-btn admin-btn-ghost admin-btn-small" onClick={() => setSelectedChapterId(ch.id)}>
                        {ch.title}
                      </button>
                    </td>
                    <td>{ch.youtube_id || '—'}</td>
                    <td>{ch.order_index}</td>
                    <td className="admin-table-actions">
                      <button className="admin-btn admin-btn-ghost admin-btn-small" onClick={() => setEditingChapter(ch)}>Edit</button>
                      <button
                        className="admin-btn admin-btn-danger admin-btn-small"
                        onClick={async () => {
                          if (!confirm('Delete this chapter and its notes?')) return
                          await adminDelete(`/admin/academics/chapters/${ch.id}`)
                          if (selectedChapterId === ch.id) setSelectedChapterId(null)
                          loadAll()
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
        </Section>
      )}

      {/* ---- Notes ---- */}
      {selectedChapterId && (
        <Section title="Notes (PDFs)" onAdd={() => setEditingNote(null)} addLabel="+ Add note">
          {editingNote !== undefined && (
            <SimpleForm
              fields={[
                { key: 'title', label: 'Title', placeholder: 'e.g. Real Numbers Notes (PDF)', span2: true },
                { key: 'link', label: 'Link', placeholder: '/notes/real-numbers.pdf or full URL', span2: true },
                { key: 'order_index', label: 'Order', type: 'number' },
              ]}
              initial={editingNote || { title: '', link: '', order_index: 0, chapter_id: selectedChapterId }}
              onCancel={() => setEditingNote(undefined)}
              onSave={async (values) => {
                const payload = { ...values, chapter_id: selectedChapterId }
                if (editingNote) await adminPut(`/admin/academics/notes/${editingNote.id}`, payload)
                else await adminPost('/admin/academics/notes', payload)
                setEditingNote(undefined)
                loadAll()
              }}
            />
          )}
          {chapterNotes.length === 0 ? (
            <div className="admin-empty-state">No notes yet for this chapter.</div>
          ) : (
            <table className="admin-table">
              <thead><tr><th>Title</th><th>Link</th><th></th></tr></thead>
              <tbody>
                {chapterNotes.map((n) => (
                  <tr key={n.id}>
                    <td>{n.title}</td>
                    <td style={{ wordBreak: 'break-all' }}>{n.link}</td>
                    <td className="admin-table-actions">
                      <button className="admin-btn admin-btn-ghost admin-btn-small" onClick={() => setEditingNote(n)}>Edit</button>
                      <button
                        className="admin-btn admin-btn-danger admin-btn-small"
                        onClick={async () => {
                          if (!confirm('Delete this note?')) return
                          await adminDelete(`/admin/academics/notes/${n.id}`)
                          loadAll()
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
        </Section>
      )}
    </div>
  )
}

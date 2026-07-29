import { useState } from 'react'
import { classesData } from '../data/content'

export default function Notes() {
  const [classId, setClassId] = useState(classesData[0]?.id)
  const activeClass = classesData.find((c) => c.id === classId) || classesData[0]

  const [subjectId, setSubjectId] = useState(activeClass?.subjects[0]?.id)
  const activeSubject =
    activeClass?.subjects.find((s) => s.id === subjectId) || activeClass?.subjects[0]

  const [videoChapter, setVideoChapter] = useState(null) // chapter currently open in the video lightbox

  const handleClassChange = (cls) => {
    setClassId(cls.id)
    setSubjectId(cls.subjects[0]?.id) // reset to that class's first subject
  }

  return (
    <section className="section-pad bg-chalk" style={{ minHeight: '60vh' }}>
      <div className="wrap">
        <p className="section-eyebrow">Study Material</p>
        <h2>Notes &amp; subject videos.</h2>

        {/* LEVEL 1 — Class / exam tabs */}
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

        {/* LEVEL 2 — Subject tabs for the selected class */}
        {activeClass && (
          <div className="notes-tabs notes-tabs-sub">
            {activeClass.subjects.map((sub) => (
              <button
                key={sub.id}
                className={`notes-tab notes-tab-sub ${sub.id === activeSubject?.id ? 'active' : ''}`}
                onClick={() => setSubjectId(sub.id)}
              >
                {sub.name}
              </button>
            ))}
          </div>
        )}

        {/* LEVEL 3 — Chapters for the selected subject, each with its own video + notes */}
        {activeSubject && (
          <div className="notes-panel">
            <div className="notes-panel-header">
              <h3>{activeSubject.name}</h3>
              <span className="notes-batch-tag">{activeClass.label}</span>
            </div>

            <ul className="notes-list">
              {activeSubject.chapters.map((ch) => (
                <li className="notes-item" key={ch.id}>
                  <div>
                    <h4>{ch.title}</h4>
                  </div>

                  <div className="notes-item-actions">
                    {ch.youtubeId ? (
                      <button className="btn btn-outline" onClick={() => setVideoChapter(ch)}>
                        Watch Video
                      </button>
                    ) : (
                      <span className="notes-soon">Video coming soon</span>
                    )}

                    {ch.notes && ch.notes.length > 0 ? (
                      ch.notes.map((note, i) => (
                        <a key={i} href={note.link} className="btn btn-outline" download>
                          {note.title || 'Download Notes'}
                        </a>
                      ))
                    ) : (
                      <span className="notes-soon">Notes coming soon</span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Video lightbox — opens when a chapter's "Watch Video" is clicked */}
      {videoChapter && (
        <div className="lightbox-overlay" onClick={() => setVideoChapter(null)}>
          <div className="lightbox-box" onClick={(e) => e.stopPropagation()}>
            <button
              className="lightbox-close"
              onClick={() => setVideoChapter(null)}
              aria-label="Close"
            >
              ×
            </button>
            <div className="lightbox-media">
              <iframe
                src={`https://www.youtube.com/embed/${videoChapter.youtubeId}`}
                title={videoChapter.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <h4>{videoChapter.title}</h4>
          </div>
        </div>
      )}
    </section>
  )
}

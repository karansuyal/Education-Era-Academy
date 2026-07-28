import { useState } from 'react'
import { subjects } from '../data/content'

export default function Notes() {
  const [activeId, setActiveId] = useState(subjects[0]?.id)
  const active = subjects.find((s) => s.id === activeId) || subjects[0]

  return (
    <section className="section-pad bg-chalk" style={{ minHeight: '60vh' }}>
      <div className="wrap">
        <p className="section-eyebrow">Study Material</p>
        <h2>Notes &amp; subject videos.</h2>

        <div className="notes-tabs">
          {subjects.map((s) => (
            <button
              key={s.id}
              className={`notes-tab ${s.id === active?.id ? 'active' : ''}`}
              onClick={() => setActiveId(s.id)}
            >
              {s.name}
            </button>
          ))}
        </div>

        {active && (
          <div className="notes-panel">
            <div className="notes-panel-header">
              <h3>{active.name}</h3>
              <span className="notes-batch-tag">{active.batch}</span>
            </div>

            <div className="notes-video-wrap">
              {active.youtubeId ? (
                <iframe
                  src={`https://www.youtube.com/embed/${active.youtubeId}`}
                  title={`${active.name} — YouTube video`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="notes-video-placeholder">
                  Video coming soon for {active.name}.
                  <br />
                  <small>(Add a YouTube video ID for "{active.id}" in src/data/content.js)</small>
                </div>
              )}
            </div>

            <ul className="notes-list">
              {active.notes.map((n) => (
                <li className="notes-item" key={n.title}>
                  <div>
                    <h4>{n.title}</h4>
                    <p>{n.desc}</p>
                  </div>
                  {n.link ? (
                    <a href={n.link} className="btn btn-outline" download>
                      Download
                    </a>
                  ) : (
                    <span className="notes-soon">Coming soon</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  )
}

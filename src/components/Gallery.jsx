import { useState } from 'react'
import { galleryItems } from '../data/content'

export default function Gallery() {
  const [active, setActive] = useState(null)

  return (
    <section className="section-pad bg-cream" id="gallery">
      <div className="wrap">
        <p className="section-eyebrow">Gallery</p>
        <h2>Campus, classrooms &amp; result day.</h2>

        <div className="gallery-grid">
          {galleryItems.map((item, i) => (
            <button
              key={i}
              className={`gallery-tile ${item.type === 'video' ? 'video-tile' : ''}`}
              onClick={() => setActive(item)}
            >
              <span className="tile-label">{item.label}</span>
            </button>
          ))}
        </div>
        {/* EDIT ME: each tile is a plain gradient placeholder right now.
            Swap the button's background for a real photo by adding an
            <img> inside .gallery-tile once you have real photos, and
            set a real youtubeId for the video tile in data/content.js */}
      </div>

      {active && (
        <div className="lightbox-overlay" onClick={() => setActive(null)}>
          <div className="lightbox-box" onClick={(e) => e.stopPropagation()}>
            <button className="lightbox-close" onClick={() => setActive(null)} aria-label="Close">×</button>
            <div className="lightbox-media">
              {active.type === 'video' && active.src ? (
                <video
                  src={active.src}
                  poster={active.poster || undefined}
                  controls
                  autoPlay
                  style={{ width: '100%', height: '100%' }}
                >
                  Your browser doesn't support video playback.
                </video>
              ) : active.type === 'video' && active.youtubeId ? (
                <iframe
                  src={`https://www.youtube.com/embed/${active.youtubeId}`}
                  title={active.label}
                  allowFullScreen
                />
              ) : (
                <span>Photo placeholder — add a real image for "{active.label}"</span>
              )}
            </div>
            <h4>{active.label}</h4>
            <p>{active.caption}</p>
          </div>
        </div>
      )}
    </section>
  )
}

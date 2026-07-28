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
              {item.type === 'image' && item.src && (
                <img
                  src={item.src}
                  alt={item.label}
                  style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain', background: 'rgba(0,0,0,0.15)' }}
                />
              )}
              <span className="tile-label" style={{ position: 'relative', zIndex: 1 }}>{item.label}</span>
            </button>
          ))}
        </div>
        {/* Images now load from the "src" path set on each item in src/data/content.js.
            Just drop your photo files into public/images/gallery/ with matching filenames. */}
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
              ) : active.src ? (
                <img
                  src={active.src}
                  alt={active.label}
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
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

import { useState } from "react";
import { useSiteData } from "../context/SiteDataContext";

export default function Gallery() {
  const { gallery: galleryItems } = useSiteData();
  const [active, setActive] = useState(null);

  return (
    <section className="section-pad bg-cream" id="gallery">
      <div className="wrap">
        <p className="section-eyebrow">Gallery</p>
        <h2>Campus, classrooms &amp; result day.</h2>

        <div className="gallery-grid">
          {galleryItems.map((item, i) => (
            <button
              key={i}
              className={`gallery-tile ${item.type === "video" ? "video-tile" : ""}`}
              onClick={() => setActive(item)}
            >
              {item.type === "image" && item.src && (
                <img
                  src={item.src}
                  alt={item.label}
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    background: "rgba(0,0,0,0.15)",
                  }}
                />
              )}
              {item.type === "video" && item.youtubeId && (
                <img
                  src={item.poster || `https://img.youtube.com/vi/${item.youtubeId}/hqdefault.jpg`}
                  alt={item.label}
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              )}
              <span
                className="tile-label"
                style={{position: "relative", zIndex: 1}}
              >
                {item.label}
              </span>
            </button>
          ))}
        </div>
        {/* Images/videos now come from the admin-managed gallery items via
            GET /public/site-content — add/edit them through the admin API. */}
      </div>

      {active && (
        <div className="lightbox-overlay" onClick={() => setActive(null)}>
          <div className="lightbox-box" onClick={(e) => e.stopPropagation()}>
            <button
              className="lightbox-close"
              onClick={() => setActive(null)}
              aria-label="Close"
            >
              ×
            </button>
            <div className="lightbox-media">
              {active.type === "video" && active.src ? (
                <video
                  src={active.src}
                  poster={active.poster || undefined}
                  controls
                  autoPlay
                  style={{width: "100%", height: "100%"}}
                >
                  Your browser doesn't support video playback.
                </video>
              ) : active.type === "video" && active.youtubeId ? (
                <iframe
                  src={`https://www.youtube.com/embed/${active.youtubeId}`}
                  title={active.label}
                  allowFullScreen
                />
              ) : active.src ? (
                <img
                  src={active.src}
                  alt={active.label}
                  style={{width: "100%", height: "100%", objectFit: "contain"}}
                />
              ) : (
                <span>
                  Photo placeholder — add a real image for "{active.label}"
                </span>
              )}
            </div>
            <h4>{active.label}</h4>
            <p>{active.caption}</p>
          </div>
        </div>
      )}
    </section>
  );
}

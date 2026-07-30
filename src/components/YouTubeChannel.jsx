import { useSiteData } from '../context/SiteDataContext'

export default function YouTubeChannel() {
  const { youtubeChannel } = useSiteData()

  // A channel's "uploads" playlist ID is always its channel ID with the
  // leading "UC" swapped for "UU" — YouTube provides this automatically,
  // so the embed below always shows the latest videos, no API key needed.
  const uploadsPlaylistId = youtubeChannel.channelId
    ? 'UU' + youtubeChannel.channelId.slice(2)
    : ''

  return (
    <section className="section-pad bg-chalk" id="youtube-channel">
      <div className="wrap yt-channel-wrap">
        <div className="yt-channel-info">
          <p className="section-eyebrow">Our YouTube Channel</p>
          <h2>Learn with us on YouTube.</h2>
          <p className="yt-channel-desc">{youtubeChannel.description}</p>

          <div className="yt-channel-card">
            <span className="yt-icon" aria-hidden="true">
              <svg viewBox="0 0 48 34" width="40" height="28">
                <rect width="48" height="34" rx="9" fill="var(--rank-red)" />
                <path d="M20 11l12 6-12 6V11z" fill="var(--chalk)" />
              </svg>
            </span>
            <div>
              <h4>{youtubeChannel.name}</h4>
              <p>{youtubeChannel.handle}</p>
            </div>
          </div>

          <div className="yt-channel-actions">
            <a
              href={`${youtubeChannel.url}${youtubeChannel.url.includes('?') ? '&' : '?'}sub_confirmation=1`}
              target="_blank"
              rel="noreferrer"
              className="btn btn-primary"
            >
              Subscribe
            </a>
            <a href={youtubeChannel.url} target="_blank" rel="noreferrer" className="btn btn-outline">
              Visit Channel
            </a>
          </div>
        </div>

        <div className="yt-channel-embed">
          {uploadsPlaylistId ? (
            <iframe
              src={`https://www.youtube.com/embed/videoseries?list=${uploadsPlaylistId}`}
              title={`${youtubeChannel.name} — latest videos`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div className="yt-embed-placeholder">
              Add your channel details in the admin panel to show your latest videos here.
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

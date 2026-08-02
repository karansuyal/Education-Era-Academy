import { useSiteData } from '../context/SiteDataContext'

// scheduled_at comes from the backend as a naive local-time string (no
// timezone suffix), e.g. "2026-08-05T18:00:00" — entered by the admin in
// their own local time (IST). `new Date(...)` on a string in that exact
// shape is parsed as local time by JS engines, which lines up correctly
// as long as visitors are also in IST (true for the target audience).
function getStatus(cls) {
  const start = new Date(cls.scheduledAt)
  const end = new Date(start.getTime() + cls.durationMinutes * 60000)
  const now = new Date()
  if (now >= start && now <= end) return 'live'
  if (now < start) return 'upcoming'
  return 'ended'
}

function formatWhen(date) {
  return date.toLocaleString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
}

export default function LiveClassBanner() {
  const { liveClasses } = useSiteData()

  const next = liveClasses
    .map((c) => ({ ...c, status: getStatus(c) }))
    .filter((c) => c.status !== 'ended')
    .sort((a, b) => new Date(a.scheduledAt) - new Date(b.scheduledAt))[0]

  if (!next) return null

  const start = new Date(next.scheduledAt)
  const isLive = next.status === 'live'

  return (
    <div className={`live-class-banner${isLive ? ' is-live' : ''}`}>
      <div className="wrap live-class-banner-inner">
        <span className="live-class-dot" aria-hidden="true" />
        <div className="live-class-text">
          <strong>{isLive ? 'Live Now' : 'Upcoming Live Class'}</strong>
          {' — '}
          {next.title}
          {next.batchLabel && <span className="live-class-batch"> · {next.batchLabel}</span>}
          <span className="live-class-time"> · {isLive ? 'In progress' : formatWhen(start)}</span>
        </div>
        <a
          className="live-class-join"
          href={next.meetingLink}
          target="_blank"
          rel="noopener noreferrer"
        >
          {isLive ? 'Join Now' : 'View Details'}
        </a>
      </div>
    </div>
  )
}

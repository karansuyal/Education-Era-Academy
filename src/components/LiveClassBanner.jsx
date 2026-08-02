import { useEffect, useState } from 'react'
import { useSiteData } from '../context/SiteDataContext'

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

  const [, forceTick] = useState(0)
  useEffect(() => {
    const id = setInterval(() => forceTick((n) => n + 1), 30000)
    return () => clearInterval(id)
  }, [])

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
        <a className="live-class-join" href={next.meetingLink} target="_blank" rel="noopener noreferrer">
          {isLive ? 'Join Now' : 'View Details'}
        </a>
      </div>
    </div>
  )
}
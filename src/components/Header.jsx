import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useSiteData } from '../context/SiteDataContext'

export default function Header() {
  const { siteInfo } = useSiteData()
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)

  return (
    <header className="site-header">
      <div className="wrap header-inner">
        <a href="/#top" className="brand" onClick={close}>
          <span className="brand-mark">{siteInfo.name[0]}</span>
          <span className="brand-name">{siteInfo.name}<em>{siteInfo.nameSuffix}</em></span>
        </a>

        <nav className={`main-nav ${open ? 'open' : ''}`}>
          <a href="/#courses" onClick={close}>Batches</a>
          <a href="/#gallery" onClick={close}>Gallery</a>
          <a href="/#youtube-channel" onClick={close}>YouTube</a>
          <a href="/#faq" onClick={close}>FAQ</a>
          <a href="/#fees" onClick={close}>Fees</a>
          <Link to="/blog" onClick={close}>Blog</Link>
          <Link to="/notes" onClick={close}>Notes</Link>
          <Link to="/doubts" onClick={close}>Ask a Doubt</Link>
          <Link to="/mock-test" onClick={close}>Mock Test</Link>
          <a href="/#contact" className="nav-cta" onClick={close}>Book Free Demo</a>
        </nav>

        <button
          className="nav-toggle"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          <span></span><span></span><span></span>
        </button>
      </div>
    </header>
  )
}

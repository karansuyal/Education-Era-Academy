import { Link } from 'react-router-dom'
import { useSiteData } from '../context/SiteDataContext'

export default function Footer() {
  const { siteInfo } = useSiteData()

  return (
    <footer className="site-footer">
      <div className="wrap footer-inner">
        <div className="brand">
          <span className="brand-mark">{siteInfo.name[0]}</span>
          <span className="brand-name">{siteInfo.name}<em>{siteInfo.nameSuffix}</em></span>
        </div>
        <nav className="footer-links">
          <a href="/#courses">Batches</a>
          <a href="/#faq">FAQ</a>
          <a href="/#fees">Fees</a>
          <Link to="/blog">Blog</Link>
          <Link to="/mock-test">Mock Test</Link>
          <a href="/#contact">Contact</a>
        </nav>
        <p className="copyright">© {new Date().getFullYear()} {siteInfo.name} {siteInfo.nameSuffix}. All rights reserved.</p>
      </div>
    </footer>
  )
}

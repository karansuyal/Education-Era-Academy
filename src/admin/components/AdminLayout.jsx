import { useEffect, useState } from 'react'
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useAdminAuth } from '../AdminAuthContext'
import '../admin.css'

const NAV_GROUPS = [
  {
    label: 'Overview',
    links: [{ to: '/admin', label: 'Dashboard', end: true }],
  },
  {
    label: 'Site',
    links: [{ to: '/admin/site-settings', label: 'Site Settings' }],
  },
  {
    label: 'Homepage content',
    links: [
      { to: '/admin/stats', label: 'Stats' },
      { to: '/admin/why-points', label: 'Why Points' },
      { to: '/admin/batches', label: 'Batches' },
      { to: '/admin/faculty', label: 'Faculty' },
      { to: '/admin/results', label: 'Results' },
      { to: '/admin/testimonials', label: 'Testimonials' },
      { to: '/admin/gallery', label: 'Gallery' },
      { to: '/admin/faqs', label: 'FAQs' },
      { to: '/admin/fee-plans', label: 'Fee Plans' },
    ],
  },
  {
    label: 'Content',
    links: [{ to: '/admin/blog', label: 'Blog Posts' }],
  },
  {
    label: 'Academics',
    links: [{ to: '/admin/academics', label: 'Classes & Notes' }],
  },
  {
    label: 'Quiz',
    links: [{ to: '/admin/quiz', label: 'Mock Tests' }],
  },
  {
    label: 'Enquiries',
    links: [{ to: '/admin/leads', label: 'Leads' }],
  },
]

export default function AdminLayout() {
  const { admin, logout } = useAdminAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  // Close the mobile drawer automatically whenever the route changes
  // (i.e. right after tapping a nav link).
  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  async function handleLogout() {
    await logout()
    navigate('/admin/login', { replace: true })
  }

  return (
    <div className="admin-shell">
      {/* Mobile-only top bar with hamburger toggle */}
      <header className="admin-topbar">
        <button
          className="admin-menu-toggle"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
        >
          {menuOpen ? '✕' : '☰'}
        </button>
        <div className="admin-topbar-brand">Education Era Academy</div>
      </header>

      {/* Backdrop shown behind the drawer on mobile when it's open */}
      {menuOpen && <div className="admin-sidebar-backdrop" onClick={() => setMenuOpen(false)} />}

      <aside className={`admin-sidebar${menuOpen ? ' open' : ''}`}>
        <div className="admin-sidebar-brand">Education Era Academy</div>
        <div className="admin-sidebar-sub">{admin ? `Signed in as ${admin.username}` : ''}</div>
        <nav className="admin-nav">
          {NAV_GROUPS.map((group) => (
            <div key={group.label}>
              <div className="admin-nav-group-label">{group.label}</div>
              {group.links.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.end}
                  className={({ isActive }) => `admin-nav-link${isActive ? ' active' : ''}`}
                >
                  {link.label}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>
        <button className="admin-logout-btn" onClick={handleLogout}>Log out</button>
      </aside>
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  )
}

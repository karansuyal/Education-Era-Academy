import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { adminGet } from '../adminApi'
import { useAdminAuth } from '../AdminAuthContext'

export default function Dashboard() {
  const { admin } = useAdminAuth()
  const [pendingLeads, setPendingLeads] = useState(null)
  const [activeTests, setActiveTests] = useState(null)

  useEffect(() => {
    adminGet('/admin/leads?is_contacted=false').then((leads) => setPendingLeads(leads.length)).catch(() => {})
    adminGet('/admin/quiz/mock-tests').then((tests) => setActiveTests(tests.filter((t) => t.is_active).length)).catch(() => {})
  }, [])

  return (
    <div>
      <h1 className="admin-page-title">Welcome{admin ? `, ${admin.username}` : ''}.</h1>
      <p className="admin-page-desc">Manage everything on the Education Era Academy site from here.</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16, marginBottom: 20 }}>
        <Link to="/admin/leads" className="admin-card" style={{ display: 'block' }}>
          <div style={{ color: 'var(--slate)', fontSize: '0.85rem' }}>Pending follow-ups</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '2rem' }}>{pendingLeads ?? '—'}</div>
        </Link>
        <Link to="/admin/quiz" className="admin-card" style={{ display: 'block' }}>
          <div style={{ color: 'var(--slate)', fontSize: '0.85rem' }}>Active mock tests</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '2rem' }}>{activeTests ?? '—'}</div>
        </Link>
      </div>

      <div className="admin-card">
        <h3 style={{ marginTop: 0 }}>Quick links</h3>
        <ul style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <li><Link to="/admin/site-settings">Update site settings (phone, WhatsApp, address)</Link></li>
          <li><Link to="/admin/blog">Post a new announcement</Link></li>
          <li><Link to="/admin/academics">Add notes for a chapter</Link></li>
          <li><Link to="/admin/leads">Check new enquiries</Link></li>
        </ul>
      </div>
    </div>
  )
}

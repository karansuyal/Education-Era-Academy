import { useEffect, useState } from 'react'
import { adminGet, adminPatch, adminDelete, getTokens } from '../adminApi'
import { wsUrl } from '../../api/client'
import useLiveSocket from '../../utils/useLiveSocket'

export default function LeadsPage() {
  const [leads, setLeads] = useState([])
  const [filter, setFilter] = useState('all') // all | pending | contacted
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  function load() {
    setLoading(true)
    const qs = filter === 'all' ? '' : `?is_contacted=${filter === 'contacted'}`
    adminGet(`/admin/leads${qs}`)
      .then(setLeads)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }

  useEffect(load, [filter])

  // Live: a new enquiry (or a status change/delete from another admin
  // tab) refreshes the table without needing a manual reload.
  const { accessToken } = getTokens()
  useLiveSocket(
    accessToken ? wsUrl(`/admin/leads/ws?token=${encodeURIComponent(accessToken)}`) : null,
    () => load(),
  )

  async function toggleContacted(lead) {
    try {
      await adminPatch(`/admin/leads/${lead.id}`, { is_contacted: !lead.is_contacted })
      load()
    } catch (err) {
      alert(err.message)
    }
  }

  async function handleDelete(lead) {
    if (!confirm(`Delete enquiry from ${lead.name}?`)) return
    try {
      await adminDelete(`/admin/leads/${lead.id}`)
      load()
    } catch (err) {
      alert(err.message)
    }
  }

  return (
    <div>
      <h1 className="admin-page-title">Leads</h1>
      <p className="admin-page-desc">Contact-form enquiries submitted from the site.</p>

      <div className="admin-breadcrumb-tabs">
        {['all', 'pending', 'contacted'].map((f) => (
          <button
            key={f}
            className={`admin-breadcrumb-tab${filter === f ? ' active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f === 'all' ? 'All' : f === 'pending' ? 'Pending follow-up' : 'Contacted'}
          </button>
        ))}
      </div>

      <div className="admin-card" style={{ padding: 0, overflowX: 'auto' }}>
        {loading ? (
          <div className="admin-empty-state">Loading…</div>
        ) : error ? (
          <div className="admin-error-banner" style={{ margin: 16 }}>{error}</div>
        ) : leads.length === 0 ? (
          <div className="admin-empty-state">No enquiries here.</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Phone</th>
                <th>Course</th>
                <th>Message</th>
                <th>Status</th>
                <th>Received</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead.id}>
                  <td>{lead.name}</td>
                  <td>{lead.phone}</td>
                  <td>{lead.course_interested}</td>
                  <td style={{ maxWidth: 220 }}>{lead.message}</td>
                  <td>
                    <span className={`admin-tag${lead.is_contacted ? ' yes' : ''}`}>
                      {lead.is_contacted ? 'Contacted' : 'Pending'}
                    </span>
                  </td>
                  <td>{new Date(lead.created_at).toLocaleString()}</td>
                  <td className="admin-table-actions">
                    <button className="admin-btn admin-btn-ghost admin-btn-small" onClick={() => toggleContacted(lead)}>
                      Mark {lead.is_contacted ? 'pending' : 'contacted'}
                    </button>
                    <button className="admin-btn admin-btn-danger admin-btn-small" onClick={() => handleDelete(lead)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

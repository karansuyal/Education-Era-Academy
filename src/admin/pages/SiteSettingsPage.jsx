import { useEffect, useState } from 'react'
import { adminGet, adminPut } from '../adminApi'

const FIELDS = [
  { key: 'name', label: 'Name', placeholder: 'Education Era' },
  { key: 'name_suffix', label: 'Name suffix', placeholder: 'Academy' },
  { key: 'tagline', label: 'Tagline', span2: true },
  { key: 'phone', label: 'Phone' },
  { key: 'whatsapp_number', label: 'WhatsApp number', placeholder: '91XXXXXXXXXX (no + or spaces)' },
  { key: 'email', label: 'Email' },
  { key: 'address', label: 'Address', span2: true, type: 'textarea' },
  { key: 'map_embed_url', label: 'Google Maps embed URL', span2: true, type: 'textarea' },
]

const YOUTUBE_FIELDS = [
  { key: 'youtube_name', label: 'Channel name' },
  { key: 'youtube_handle', label: 'Channel handle' },
  { key: 'youtube_url', label: 'Channel URL', span2: true },
  { key: 'youtube_channel_id', label: 'Channel ID' },
  { key: 'youtube_description', label: 'Channel description', span2: true, type: 'textarea' },
]

export default function SiteSettingsPage() {
  const [values, setValues] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    adminGet('/admin/site-settings')
      .then(setValues)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  function setField(key, value) {
    setValues((prev) => ({ ...prev, [key]: value }))
    setSaved(false)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      const { id, ...payload } = values
      const updated = await adminPut('/admin/site-settings', payload)
      setValues(updated)
      setSaved(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <p>Loading…</p>
  if (!values) return <div className="admin-error-banner">{error || 'Could not load site settings.'}</div>

  return (
    <div>
      <h1 className="admin-page-title">Site Settings</h1>
      <p className="admin-page-desc">These fields power the header, footer, and contact section across the whole site.</p>

      <form onSubmit={handleSubmit}>
        {error && <div className="admin-error-banner">{error}</div>}
        {saved && <div className="admin-card" style={{ background: '#EFF6EC', borderColor: '#C9E3BE' }}>Saved.</div>}

        <div className="admin-card">
          <h3 style={{ marginTop: 0 }}>General</h3>
          <div className="admin-form-grid">
            {FIELDS.map((f) => (
              <div key={f.key} className={`admin-form-field${f.span2 ? ' span-2' : ''}`}>
                <label htmlFor={f.key}>{f.label}</label>
                {f.type === 'textarea' ? (
                  <textarea id={f.key} value={values[f.key] || ''} onChange={(e) => setField(f.key, e.target.value)} />
                ) : (
                  <input id={f.key} value={values[f.key] || ''} placeholder={f.placeholder} onChange={(e) => setField(f.key, e.target.value)} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="admin-card">
          <h3 style={{ marginTop: 0 }}>YouTube Channel</h3>
          <div className="admin-form-grid">
            {YOUTUBE_FIELDS.map((f) => (
              <div key={f.key} className={`admin-form-field${f.span2 ? ' span-2' : ''}`}>
                <label htmlFor={f.key}>{f.label}</label>
                {f.type === 'textarea' ? (
                  <textarea id={f.key} value={values[f.key] || ''} onChange={(e) => setField(f.key, e.target.value)} />
                ) : (
                  <input id={f.key} value={values[f.key] || ''} onChange={(e) => setField(f.key, e.target.value)} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="admin-form-actions">
          <button className="admin-btn admin-btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Save changes'}</button>
        </div>
      </form>
    </div>
  )
}

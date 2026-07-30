import { useEffect, useState } from 'react'
import { adminGet, adminPost, adminPut, adminDelete } from '../adminApi'

// ============================================================
// Generic CRUD page, driven by a `resource` config object:
//
// {
//   endpoint: '/admin/stats',
//   title: 'Stats',
//   description: '...',
//   emptyItem: { num: '', label: '', order_index: 0 },
//   fields: [
//     { key: 'num', label: 'Number', type: 'text' },
//     { key: 'label', label: 'Label', type: 'text', span2: true },
//     { key: 'order_index', label: 'Order', type: 'number' },
//   ],
//   columns: [ { key: 'num', label: 'Number' }, ... ]  // defaults to fields
// }
//
// Handles list / create / edit / delete for any resource whose backend
// endpoint follows the admin CRUD-factory shape (GET/POST list, GET/PUT/
// DELETE by id).
// ============================================================

function fieldToInputValue(field, value) {
  if (field.type === 'stringList') return Array.isArray(value) ? value.join(', ') : ''
  if (value === null || value === undefined) return ''
  return value
}

function inputValueToField(field, raw) {
  if (field.type === 'number') return raw === '' ? 0 : Number(raw)
  if (field.type === 'checkbox') return !!raw
  if (field.type === 'stringList') {
    return raw
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
  }
  return raw
}

function ItemForm({ resource, initial, onCancel, onSaved }) {
  const [values, setValues] = useState(() => {
    const v = {}
    for (const field of resource.fields) {
      v[field.key] = fieldToInputValue(field, initial ? initial[field.key] : resource.emptyItem[field.key])
    }
    return v
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  function setField(key, raw) {
    setValues((prev) => ({ ...prev, [key]: raw }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      const payload = {}
      for (const field of resource.fields) {
        payload[field.key] = inputValueToField(field, values[field.key])
      }
      if (initial) {
        await adminPut(`${resource.endpoint}/${initial.id}`, payload)
      } else {
        await adminPost(resource.endpoint, payload)
      }
      onSaved()
    } catch (err) {
      setError(err.message || 'Something went wrong')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form className="admin-card" onSubmit={handleSubmit}>
      {error && <div className="admin-error-banner">{error}</div>}
      <div className="admin-form-grid">
        {resource.fields.map((field) => (
          <div key={field.key} className={`admin-form-field${field.span2 ? ' span-2' : ''}`}>
            <label htmlFor={field.key}>{field.label}</label>
            {field.type === 'textarea' ? (
              <textarea
                id={field.key}
                value={values[field.key]}
                onChange={(e) => setField(field.key, e.target.value)}
              />
            ) : field.type === 'checkbox' ? (
              <div className="admin-checkbox-row">
                <input
                  id={field.key}
                  type="checkbox"
                  checked={!!values[field.key]}
                  onChange={(e) => setField(field.key, e.target.checked)}
                />
              </div>
            ) : field.type === 'select' ? (
              <select
                id={field.key}
                value={values[field.key]}
                onChange={(e) => setField(field.key, e.target.value)}
              >
                {field.options.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            ) : (
              <input
                id={field.key}
                type={field.type === 'number' ? 'number' : field.type === 'date' ? 'date' : 'text'}
                value={values[field.key]}
                onChange={(e) => setField(field.key, e.target.value)}
                placeholder={field.placeholder}
              />
            )}
            {field.hint && <span style={{ fontSize: '0.75rem', color: 'var(--slate)' }}>{field.hint}</span>}
          </div>
        ))}
      </div>
      <div className="admin-form-actions">
        <button className="admin-btn admin-btn-primary" disabled={saving}>
          {saving ? 'Saving…' : initial ? 'Save changes' : 'Create'}
        </button>
        <button type="button" className="admin-btn admin-btn-ghost" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  )
}

export default function CrudPage({ resource }) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [editing, setEditing] = useState(undefined) // undefined = hidden, null = new, object = editing
  const columns = resource.columns || resource.fields

  function load() {
    setLoading(true)
    adminGet(resource.endpoint)
      .then((data) => setItems(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }

  useEffect(load, [resource.endpoint])

  async function handleDelete(item) {
    if (!confirm(`Delete this ${resource.singularName || 'item'}? This can't be undone.`)) return
    try {
      await adminDelete(`${resource.endpoint}/${item.id}`)
      load()
    } catch (err) {
      alert(err.message)
    }
  }

  return (
    <div>
      <h1 className="admin-page-title">{resource.title}</h1>
      {resource.description && <p className="admin-page-desc">{resource.description}</p>}

      {editing !== undefined ? (
        <ItemForm
          resource={resource}
          initial={editing}
          onCancel={() => setEditing(undefined)}
          onSaved={() => {
            setEditing(undefined)
            load()
          }}
        />
      ) : (
        <>
          <div className="admin-toolbar">
            <button className="admin-btn admin-btn-primary" onClick={() => setEditing(null)}>
              + Add {resource.singularName || 'item'}
            </button>
          </div>

          <div className="admin-card" style={{ padding: 0, overflowX: 'auto' }}>
            {loading ? (
              <div className="admin-empty-state">Loading…</div>
            ) : error ? (
              <div className="admin-error-banner" style={{ margin: 16 }}>{error}</div>
            ) : items.length === 0 ? (
              <div className="admin-empty-state">Nothing here yet — add the first one above.</div>
            ) : (
              <table className="admin-table">
                <thead>
                  <tr>
                    {columns.map((c) => <th key={c.key}>{c.label}</th>)}
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.id}>
                      {columns.map((c) => (
                        <td key={c.key}>
                          {c.type === 'checkbox'
                            ? <span className={`admin-tag${item[c.key] ? ' yes' : ''}`}>{item[c.key] ? 'Yes' : 'No'}</span>
                            : c.type === 'stringList'
                              ? (item[c.key] || []).join(', ')
                              : String(item[c.key] ?? '')}
                        </td>
                      ))}
                      <td className="admin-table-actions">
                        <button className="admin-btn admin-btn-ghost admin-btn-small" onClick={() => setEditing(item)}>Edit</button>
                        <button className="admin-btn admin-btn-danger admin-btn-small" onClick={() => handleDelete(item)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}
    </div>
  )
}

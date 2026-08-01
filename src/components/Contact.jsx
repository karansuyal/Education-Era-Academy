import { useState } from 'react'
import { useSiteData } from '../context/SiteDataContext'
import { submitContactLead } from '../api/client'

export default function Contact() {
  const { siteInfo } = useSiteData()
  const [form, setForm] = useState({ name: '', phone: '', course: '', message: '' })
  const [submitting, setSubmitting] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    // Save the lead to the backend so it shows up in the admin panel —
    // but never let a slow/failed API call block the WhatsApp message,
    // since that's the part the student actually needs right now.
    try {
      await submitContactLead({
        name: form.name,
        phone: form.phone,
        courseInterested: form.course,
        message: form.message,
      })
    } catch (err) {
      console.error('Could not save enquiry to backend:', err)
    } finally {
      setSubmitting(false)
    }

    const lines = [
      'New enquiry from the website:',
      `Name: ${form.name}`,
      `Phone: ${form.phone}`,
      `Interested in: ${form.course}`,
    ]
    if (form.message) lines.push(`Message: ${form.message}`)

    const text = encodeURIComponent(lines.join('\n'))
    window.open(`https://wa.me/${siteInfo.whatsappNumber}?text=${text}`, '_blank')
    setForm({ name: '', phone: '', course: '', message: '' })
  }

  return (
    <section className="section-pad bg-chalk" id="contact">
      <div className="wrap contact-inner">
        <div className="contact-copy">
          <p className="section-eyebrow">Enquiry</p>
          <h2>Book your free demo class.</h2>
          <p className="hero-sub" style={{ color: 'var(--slate)' }}>
            Fill this in and it opens straight into WhatsApp — no waiting for a callback.
          </p>

          <div className="contact-details">
            <p><strong>Address</strong> {siteInfo.address}</p>
            <p><strong>Phone</strong> {siteInfo.phone}</p>
            <p><strong>Email</strong> {siteInfo.email}</p>
          </div>

          {siteInfo.mapEmbedUrl && (
            <div className="map-embed">
              <iframe src={siteInfo.mapEmbedUrl} title="Location map" loading="lazy" />
            </div>
          )}
        </div>

        <form className="enquiry-form" onSubmit={handleSubmit}>
          <label>
            Full name
            <input type="text" name="name" required value={form.name} onChange={handleChange} placeholder="e.g. Karan Suyal" />
          </label>
          <label>
            Phone number
            <input type="tel" name="phone" required value={form.phone} onChange={handleChange} placeholder="10-digit mobile number" />
          </label>
          <label>
            Class / course interested
            <select name="course" required value={form.course} onChange={handleChange}>
              <option value="" disabled>Select one</option>
              <option>Foundation — Class 9 &amp; 10</option>
              <option>Class 11 &amp; 12 — Science</option>
              <option>Government Exam Preparation</option>
              <option>Computer Applications &amp; Coding</option>
              <option>Not sure yet</option>
            </select>
          </label>
          <label>
            Message (optional)
            <textarea name="message" rows="3" value={form.message} onChange={handleChange} placeholder="Any specific subject or exam?" />
          </label>
          <button type="submit" className="btn btn-primary btn-full" disabled={submitting}>
            {submitting ? 'Sending…' : 'Send via WhatsApp'}
          </button>
          <p className="form-note">Opens WhatsApp with your details filled in, and saves your enquiry with us.</p>
        </form>
      </div>
    </section>
  )
}

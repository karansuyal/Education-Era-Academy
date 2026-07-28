import { useState } from 'react'
import { siteInfo } from '../data/content'

export default function Contact() {
  const [form, setForm] = useState({ name: '', phone: '', course: '', message: '' })

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
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
              <option>Not sure yet</option>
            </select>
          </label>
          <label>
            Message (optional)
            <textarea name="message" rows="3" value={form.message} onChange={handleChange} placeholder="Any specific subject or exam?" />
          </label>
          <button type="submit" className="btn btn-primary btn-full">Send via WhatsApp</button>
          <p className="form-note">Opens WhatsApp with your details filled in — nothing is stored on this site.</p>
        </form>
      </div>
    </section>
  )
}

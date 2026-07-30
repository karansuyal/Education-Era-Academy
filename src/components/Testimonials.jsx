import { useSiteData } from '../context/SiteDataContext'

export default function Testimonials() {
  const { testimonials } = useSiteData()

  return (
    <section className="section-pad bg-cream" id="testimonials">
      <div className="wrap">
        <p className="section-eyebrow">Students Say</p>
        <h2>What changed after joining.</h2>

        <div className="quote-grid">
          {testimonials.map((t, i) => (
            <blockquote className="quote-card" key={i}>
              <p>"{t.quote}"</p>
              <cite>— {t.author}</cite>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  )
}

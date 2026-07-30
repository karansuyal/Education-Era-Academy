import { useSiteData } from '../context/SiteDataContext'

export default function Courses() {
  const { batches } = useSiteData()

  return (
    <section className="section-pad bg-cream" id="courses">
      <div className="wrap">
        <p className="section-eyebrow">Batches</p>
        <h2>Pick your batch code.</h2>

        <div className="batch-grid">
          {batches.map((b) => (
            <article className={`batch-card ${b.featured ? 'featured' : ''}`} key={b.code}>
              <div className="batch-code">{b.code}</div>
              <h3>{b.title}</h3>
              <p>{b.desc}</p>
              <ul className="batch-meta">
                {b.meta.map((m) => <li key={m}>{m}</li>)}
              </ul>
              <a href="/#contact" className="btn btn-outline">Enquire</a>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

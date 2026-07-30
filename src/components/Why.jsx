import { useSiteData } from '../context/SiteDataContext'

export default function Why() {
  const { whyPoints } = useSiteData()

  return (
    <section className="section-pad bg-chalk">
      <div className="wrap">
        <p className="section-eyebrow">Why Education Era</p>
        <h2>Built for students who show up every single day.</h2>
        <div className="why-grid">
          {whyPoints.map((w) => (
            <div className="why-card" key={w.code}>
              <span className="why-num">{w.code}</span>
              <h3>{w.title}</h3>
              <p>{w.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

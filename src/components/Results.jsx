import { useSiteData } from '../context/SiteDataContext'

export default function Results() {
  const { results } = useSiteData()

  return (
    <section className="section-pad bg-ink" id="results">
      <div className="wrap">
        <p className="section-eyebrow">Results</p>
        <h2>Rank card, not a promise.</h2>

        <div className="rank-grid">
          {results.map((r, i) => (
            <div className="rank-card" key={i}>
              <span className="rank-tag">{r.tag}</span>
              <h4>{r.name}</h4>
              <p>{r.exam}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

import { useSiteData } from '../context/SiteDataContext'

export default function Fees() {
  const { feePlans } = useSiteData()

  return (
    <section className="section-pad bg-cream" id="fees">
      <div className="wrap">
        <p className="section-eyebrow">Fees</p>
        <h2>Full payment or monthly EMI — your choice.</h2>

        <div className="fee-grid">
          {feePlans.map((f) => (
            <div className={`fee-card ${f.featured ? 'featured' : ''}`} key={f.name}>
              <h3>{f.name}</h3>
              <div className="fee-price">{f.priceFull}</div>
              <div className="fee-emi">or {f.priceEmi}</div>
              <ul className="fee-includes">
                {f.includes.map((inc) => <li key={inc}>{inc}</li>)}
              </ul>
              <a href="/#contact" className="btn btn-outline">Ask about this plan</a>
            </div>
          ))}
        </div>
        <p style={{ fontSize: '0.82rem', color: 'var(--slate)', marginTop: '20px' }}>
          Fees shown are indicative — final amount depends on batch size and any ongoing offers. Ask us for the current fee sheet.
        </p>
      </div>
    </section>
  )
}

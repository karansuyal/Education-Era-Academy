import { stats } from '../data/content'

export default function Hero() {
  return (
    <section className="hero" id="top">
      <div className="wrap hero-inner">
        <div className="hero-copy">
          <p className="eyebrow">Admissions Open · Batch 2026</p>
          <h1>Foundation to <span className="hl">Final Rank.</span></h1>
          <p className="hero-sub">
            Classroom coaching for Class 9–12 (Science &amp; Commerce) and full-time
            Government Exam preparation — SSC, Banking, Railways &amp; State PSC.
            Small batches, doubt-clearing every evening, results you can check.
          </p>
          <div className="hero-actions">
            <a href="/#contact" className="btn btn-primary">Book a Free Demo Class</a>
            <a href="/#courses" className="btn btn-ghost">View Batches</a>
          </div>

          <div className="stat-row">
            {stats.map((s) => (
              <div className="stat" key={s.label}>
                <span className="stat-num">{s.num}</span>
                <span className="stat-label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="hero-visual" aria-hidden="true">
          <div className="admit-card">
            <div className="admit-card-top">
              <span className="admit-card-title">ADMIT CARD</span>
              <span className="admit-card-code">SES/2026/104</span>
            </div>
            <div className="admit-card-row"><span>Candidate</span><span>___________</span></div>
            <div className="admit-card-row"><span>Batch</span><span>Foundation · XI-XII</span></div>
            <div className="admit-card-row"><span>Centre</span><span>Education Era Academy, Rudrapur</span></div>
            <div className="admit-card-row"><span>Roll No.</span><span>SA-2026-0104</span></div>
            <div className="admit-card-stamp">VERIFIED</div>
          </div>
        </div>
      </div>
    </section>
  )
}

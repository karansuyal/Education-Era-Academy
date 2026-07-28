import { faculty } from '../data/content'

export default function Faculty() {
  return (
    <section className="section-pad bg-chalk" id="faculty">
      <div className="wrap">
        <p className="section-eyebrow">Faculty</p>
        <h2>The people behind the rank cards.</h2>

        <div className="faculty-grid">
          {faculty.map((f) => (
            <div className="faculty-card" key={f.initials}>
              <div className="faculty-photo" aria-hidden="true">{f.initials}</div>
              <h3>{f.name}</h3>
              <p>{f.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

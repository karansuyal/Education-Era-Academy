import { useState } from 'react'
import { faqs } from '../data/content'

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0)

  const toggle = (i) => setOpenIndex(openIndex === i ? -1 : i)

  return (
    <section className="section-pad bg-chalk" id="faq">
      <div className="wrap">
        <p className="section-eyebrow">FAQ</p>
        <h2>Questions parents &amp; students ask.</h2>

        <div className="faq-list">
          {faqs.map((f, i) => (
            <div className={`faq-item ${openIndex === i ? 'open' : ''}`} key={i}>
              <button className="faq-question" onClick={() => toggle(i)} aria-expanded={openIndex === i}>
                {f.q}
                <span className="faq-icon">{openIndex === i ? '−' : '+'}</span>
              </button>
              <div className="faq-answer">
                <p>{f.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

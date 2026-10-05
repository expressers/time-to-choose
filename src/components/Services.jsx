import { useState } from 'react'
import { ArrowRight, ArrowUpRight } from '@phosphor-icons/react'
import { useLang } from '../lang.jsx'
import { scrollToId } from '../motion.js'
import Img from '../img.jsx'

export default function Services({ onPick }) {
  const { t } = useLang()
  const [active, setActive] = useState(0)
  const [prev, setPrev] = useState(-1)

  const pick = (i) => {
    if (i === active) return
    setPrev(active)
    setActive(i)
  }

  return (
    <section className="services" id="services" aria-labelledby="services-title">
      <div className="wrap">
        <h2 className="h2 rv" id="services-title">
          {t.servicesSection.title}
        </h2>
        <div className="services__grid">
          <ul className="svc">
            {t.services.map((s, i) => (
              <li key={s.id} data-active={i === active} className="rv">
                <button
                  type="button"
                  className="svc__btn"
                  aria-expanded={i === active}
                  aria-controls={`svc-${s.id}`}
                  onClick={() => pick(i)}
                  onMouseEnter={() => window.matchMedia('(hover: hover)').matches && pick(i)}
                  onFocus={() => pick(i)}
                >
                  <h3>{s.name}</h3>
                  <ArrowRight size={28} weight="light" aria-hidden="true" />
                </button>
                <div className="svc__body" id={`svc-${s.id}`}>
                  <div>
                    <Img className="svc__mimg" name={s.img} alt={s.alt} sizes="100vw" />
                    <p>{s.text}</p>
                    <button
                      type="button"
                      className="link"
                      tabIndex={i === active ? 0 : -1}
                      onClick={() => {
                        onPick(s.id)
                        scrollToId('plan')
                      }}
                    >
                      <span>{t.servicesSection.cta}</span>
                      <ArrowUpRight size={16} weight="bold" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <div className="svc__visual" aria-hidden="true">
            {t.services.map((s, i) => (
              <Img
                key={s.id}
                name={s.img}
                alt=""
                sizes="(max-width: 860px) 100vw, 45vw"
                data-active={i === active}
                data-was={i === prev}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

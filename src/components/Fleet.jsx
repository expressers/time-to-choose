import { useRef, useState } from 'react'
import { useLang } from '../lang.jsx'
import Img from '../img.jsx'

const POS = { sedan: '50% 72%', van: '50% 50%', vansun: '50% 78%', coach: '62% 55%' }

export default function Fleet() {
  const { t } = useLang()
  const [i, setI] = useState(0)
  const tabs = useRef([])
  const items = t.fleet.items
  const cur = items[i]

  const onKey = (e) => {
    const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0
    if (!d) return
    e.preventDefault()
    const n = (i + d + items.length) % items.length
    setI(n)
    tabs.current[n]?.focus()
  }

  return (
    <section className="fleet" id="fleet" aria-labelledby="fleet-title">
      <div className="fleet__media">
        {items.map((f, k) => (
          <Img key={f.id} name={f.img} alt={f.alt} data-active={k === i} aria-hidden={k !== i} style={{ objectPosition: POS[f.img] }} />
        ))}
      </div>
      <div className="wrap fleet__top">
        <h2 className="h2 rv" id="fleet-title">
          {t.fleet.title}
        </h2>
      </div>
      <div className="wrap fleet__bottom">
        <div className="fleet__info" id="fleet-panel" role="tabpanel" aria-labelledby={`tab-${cur.id}`}>
          <div className="fleet__pax">
            <b key={cur.pax} className="swap" style={{ animation: 'rise 600ms var(--ease-out)' }}>
              {cur.pax}
            </b>
            <span>{t.fleet.pax}</span>
          </div>
          <p className="fleet__text">
            <span className="swap" key={cur.id + t.fleet.pax}>
              {cur.text}
            </span>
          </p>
        </div>
        <div className="fleet__tabs" role="tablist" aria-label={t.nav.fleet} onKeyDown={onKey}>
          {items.map((f, k) => (
            <button
              key={f.id}
              id={`tab-${f.id}`}
              ref={(el) => (tabs.current[k] = el)}
              className="fleet__tab"
              role="tab"
              type="button"
              aria-selected={k === i}
              aria-controls="fleet-panel"
              tabIndex={k === i ? 0 : -1}
              onClick={() => setI(k)}
            >
              {f.name}
            </button>
          ))}
        </div>
        <p className="fleet__note">{t.fleet.note}</p>
      </div>
    </section>
  )
}

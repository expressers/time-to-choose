import { useLayoutEffect, useRef } from 'react'
import { useLang } from '../lang.jsx'
import { gsap, reduced } from '../motion.js'
import Img from '../img.jsx'

export default function Angola() {
  const { t } = useLang()
  const root = useRef(null)
  const cities = t.angola.cities

  useLayoutEffect(() => {
    const q = gsap.utils.selector(root)
    if (reduced()) {
      gsap.set(q('.angola__hero img'), { clipPath: 'inset(0% 0% 0% 0%)' })
      return
    }
    const ctx = gsap.context(() => {
      gsap
        .timeline({
          scrollTrigger: { trigger: q('.angola__hero')[0], start: 'top 85%', end: 'top top', scrub: 0.6 },
        })
        .fromTo(
          q('.angola__hero img'),
          { clipPath: 'inset(12% 14% 12% 14%)', scale: 1.15 },
          { clipPath: 'inset(0% 0% 0% 0%)', scale: 1, ease: 'none' }
        )
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section className="angola" id="angola" ref={root} aria-labelledby="angola-title">
      <div className="angola__hero">
        <Img name="lua" alt={t.angola.alt} />
        <div className="angola__title wrap">
          <h2 className="h2 rv" id="angola-title">
            {t.angola.title}
          </h2>
          <p className="lede rv">{t.angola.text}</p>
        </div>
      </div>
      <div className="marquee" aria-label={cities.join(', ')}>
        <div className="marquee__row" aria-hidden="true">
          {[...cities, ...cities].map((c, i) => (
            <span key={i}>{c}</span>
          ))}
        </div>
      </div>
      <div className="wrap promises">
        {t.angola.promises.map((p) => (
          <div className="promise rv" key={p.title}>
            <h3>{p.title}</h3>
            <p>{p.text}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

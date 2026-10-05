import { useLayoutEffect, useRef } from 'react'
import { Check, ArrowUpRight } from '@phosphor-icons/react'
import { useLang } from '../lang.jsx'
import { gsap, reduced, scrollToId } from '../motion.js'
import Img from '../img.jsx'

export default function Stays({ onPick }) {
  const { t } = useLang()
  const root = useRef(null)

  useLayoutEffect(() => {
    if (reduced()) return
    const q = gsap.utils.selector(root)
    const ctx = gsap.context(() => {
      q('.par img').forEach((img, i) => {
        gsap.fromTo(
          img,
          { yPercent: -8 },
          {
            yPercent: i ? 4 : 0,
            ease: 'none',
            scrollTrigger: { trigger: img.parentElement, start: 'top bottom', end: 'bottom top', scrub: true },
          }
        )
      })
      q('.par').forEach((el) => {
        gsap.fromTo(
          el,
          { clipPath: 'inset(18% 10% 18% 10%)' },
          {
            clipPath: 'inset(0% 0% 0% 0%)',
            ease: 'power2.out',
            scrollTrigger: { trigger: el, start: 'top 92%', end: 'top 35%', scrub: 0.5 },
          }
        )
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section className="stays" id="stays" ref={root} aria-labelledby="stays-title">
      <div className="wrap stays__grid">
        <div className="stays__a par">
          <Img name="villa" alt={t.stays.altA} sizes="(max-width: 860px) 100vw, 58vw" />
        </div>
        <div className="stays__b par">
          <Img name="apart" alt={t.stays.altB} sizes="34vw" />
        </div>
        <div className="stays__copy">
          <h2 className="h2 rv" id="stays-title">
            {t.stays.title}
          </h2>
          <p className="rv">{t.stays.text}</p>
          <ul className="ticks rv">
            {t.stays.points.map((p) => (
              <li key={p}>
                <Check size={16} weight="bold" aria-hidden="true" />
                {p}
              </li>
            ))}
          </ul>
          <button
            type="button"
            className="link rv"
            onClick={() => {
              onPick('stays')
              scrollToId('plan')
            }}
          >
            <span>{t.stays.cta}</span>
            <ArrowUpRight size={16} weight="bold" aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  )
}

import { useLayoutEffect, useRef } from 'react'
import { useLang } from '../lang.jsx'
import { gsap, reduced } from '../motion.js'
import Img from '../img.jsx'

// 14:05 → 15:20: o ponteiro dos minutos percorre 75 minutos ao longo da secção
const START_MIN = 5
const SPAN_MIN = 75
const markers = [5, 30, 45, 80]

function Dial() {
  return (
    <svg className="dial" viewBox="0 0 200 200" aria-hidden="true">
      <circle cx="100" cy="100" r="96" fill="rgba(11,10,9,.35)" stroke="rgba(242,236,224,.22)" strokeWidth="1" />
      {Array.from({ length: 60 }, (_, i) => (
        <line
          key={i}
          x1="100"
          y1="8"
          x2="100"
          y2={i % 5 === 0 ? 20 : 13}
          stroke={i % 5 === 0 ? 'rgba(242,236,224,.6)' : 'rgba(242,236,224,.25)'}
          strokeWidth={i % 5 === 0 ? 1.6 : 1}
          transform={`rotate(${i * 6} 100 100)`}
        />
      ))}
      {markers.map((m) => (
        <circle key={m} cx="100" cy="30" r="3" fill="#c9a45c" transform={`rotate(${(m % 60) * 6} 100 100)`} />
      ))}
      <line
        className="dial__hour"
        x1="100"
        y1="100"
        x2="100"
        y2="56"
        stroke="#f2ece0"
        strokeWidth="4"
        style={{ transformOrigin: '100px 100px' }}
      />
      <g className="dial__hand">
        <line x1="100" y1="112" x2="100" y2="22" stroke="#e8d29c" strokeWidth="2.2" />
      </g>
      <circle cx="100" cy="100" r="7" fill="#e8d29c" />
      <circle cx="100" cy="100" r="2.5" fill="#0b0a09" />
    </svg>
  )
}

export default function Arrival() {
  const { t } = useLang()
  const root = useRef(null)
  const scenes = t.arrival.scenes

  useLayoutEffect(() => {
    const q = gsap.utils.selector(root)
    const ctx = gsap.context(() => {
      const hand = q('.dial__hand')
      const hour = q('.dial__hour')
      gsap.set(hand, { rotation: START_MIN * 6, svgOrigin: '100 100' })
      gsap.set(hour, { rotation: (2 + START_MIN / 60) * 30, svgOrigin: '100 100' })
      if (reduced()) {
        // sem movimento: cenas trocam por opacidade
        const tl = gsap.timeline({
          scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom bottom', scrub: true },
        })
        q('.scene').forEach((s, i) => {
          if (!i) return
          tl.fromTo(s, { clipPath: 'inset(0 0 0 0)', opacity: 0 }, { opacity: 1, duration: 0.3 }, i)
          tl.to(q('.copy')[i - 1], { autoAlpha: 0, duration: 0.2 }, i)
          tl.to(q('.copy')[i], { autoAlpha: 1, duration: 0.2 }, i + 0.1)
        })
        tl.to({}, { duration: 0.6 })
        return
      }
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom bottom', scrub: 0.6 },
      })
      const n = scenes.length
      tl.to(hand, { rotation: (START_MIN + SPAN_MIN) * 6, duration: n }, 0)
      tl.to(hour, { rotation: (2 + (START_MIN + SPAN_MIN) / 60) * 30, duration: n }, 0)
      q('.scene img').forEach((img, i) => {
        tl.fromTo(img, { scale: 1.14 }, { scale: 1, duration: i === 0 ? 1.6 : 1.8 }, i === 0 ? 0 : i - 0.6)
      })
      q('.arrival__track b').forEach((b, i) => {
        tl.to(b, { scaleX: 1, duration: 1 }, i)
      })
      for (let i = 1; i < n; i++) {
        const at = i - 0.35
        tl.fromTo(
          q('.scene')[i],
          { clipPath: 'inset(100% 0% 0% 0%)' },
          { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.6, ease: 'power2.inOut' },
          at
        )
        tl.to(q('.copy')[i - 1], { autoAlpha: 0, y: -24, filter: 'blur(6px)', duration: 0.3, ease: 'power1.in' }, at)
        tl.fromTo(
          q('.copy')[i],
          { autoAlpha: 0, y: 32, filter: 'blur(6px)' },
          { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 0.35, ease: 'power2.out' },
          at + 0.3
        )
      }
    }, root)
    return () => ctx.revert()
  }, [scenes.length])

  return (
    <section className="arrival" id="arrival" ref={root} aria-labelledby="arrival-title">
      <div className="arrival__stage">
        {scenes.map((s, i) => (
          <div className="scene" key={s.img} aria-hidden={i !== 0}>
            <Img name={s.img} alt={s.alt} eager={i < 2} style={s.img === 'pickup' ? { objectPosition: '32% 50%' } : undefined} />
          </div>
        ))}
        <div className="arrival__head">
          <span id="arrival-title">{t.arrival.title}</span>
          <div className="arrival__track" aria-hidden="true">
            {scenes.map((s) => (
              <i key={s.img}>
                <b />
              </i>
            ))}
          </div>
        </div>
        <div className="arrival__ui wrap">
          <div className="copies">
            {scenes.map((s) => (
              <article className="copy" key={s.img}>
                <div className="copy__time">
                  <b>{s.time}</b>
                  <span>{s.label}</span>
                </div>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </article>
            ))}
          </div>
          <Dial />
        </div>
      </div>
    </section>
  )
}

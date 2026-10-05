import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { CaretDown, ArrowRight } from '@phosphor-icons/react'
import { useLang } from '../lang.jsx'
import { gsap, ScrollTrigger, reduced } from '../motion.js'
import { bookingUrl, openBooking, today } from '../booking.js'

function luandaNow() {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Africa/Luanda',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(new Date())
  const h = +parts.find((p) => p.type === 'hour').value
  const m = +parts.find((p) => p.type === 'minute').value
  return { h, m }
}

function Clock() {
  const { t } = useLang()
  const [now, setNow] = useState(luandaNow)
  useEffect(() => {
    const id = setInterval(() => setNow(luandaNow()), 10000)
    return () => clearInterval(id)
  }, [])
  const z = (n) => String(n).padStart(2, '0')
  const hA = ((now.h % 12) + now.m / 60) * 30
  const mA = now.m * 6
  return (
    <div className="clock">
      <div>
        <span className="clock__label">{t.clock}</span>
        <time className="clock__time" dateTime={`${z(now.h)}:${z(now.m)}`}>
          {z(now.h)}:{z(now.m)}
        </time>
      </div>
      <svg className="clock__dial" viewBox="0 0 100 100" aria-hidden="true">
        <circle cx="50" cy="50" r="47" fill="none" stroke="rgba(242,236,224,.28)" strokeWidth="1.5" />
        {Array.from({ length: 12 }, (_, i) => (
          <line
            key={i}
            x1="50"
            y1="7"
            x2="50"
            y2={i % 3 === 0 ? 15 : 11}
            stroke="rgba(242,236,224,.45)"
            strokeWidth="1.5"
            transform={`rotate(${i * 30} 50 50)`}
          />
        ))}
        <line x1="50" y1="50" x2="50" y2="28" stroke="#f2ece0" strokeWidth="3" transform={`rotate(${hA} 50 50)`} />
        <line x1="50" y1="50" x2="50" y2="14" stroke="#e8d29c" strokeWidth="2" transform={`rotate(${mA} 50 50)`} />
        <circle cx="50" cy="50" r="4.5" fill="#e8d29c" />
      </svg>
    </div>
  )
}

export function Select({ id, value, onChange, children, ...rest }) {
  return (
    <>
      <select id={id} value={value} onChange={onChange} {...rest}>
        {children}
      </select>
      <CaretDown className="chev" size={14} weight="bold" aria-hidden="true" />
    </>
  )
}

function Quick() {
  const { t, lang } = useLang()
  const [service, setService] = useState('transfer')
  const [date, setDate] = useState('')
  const [pax, setPax] = useState('1')
  const submit = (e) => {
    e.preventDefault()
    openBooking(bookingUrl(t, { service, date, pax }, lang))
  }
  return (
    <form className="quick hero-in" onSubmit={submit} aria-label={t.quick.submit}>
      <div className="quick__f">
        <label htmlFor="q-service">{t.quick.service}</label>
        <Select id="q-service" value={service} onChange={(e) => setService(e.target.value)}>
          {t.services.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </Select>
      </div>
      <div className="quick__f">
        <label htmlFor="q-date">{t.quick.date}</label>
        <input id="q-date" type="date" min={today()} value={date} onChange={(e) => setDate(e.target.value)} />
      </div>
      <div className="quick__f">
        <label htmlFor="q-pax">{t.quick.pax}</label>
        <Select id="q-pax" value={pax} onChange={(e) => setPax(e.target.value)}>
          {['1', '2', '3', '4', '5', '6', '7', '8-15', '16+'].map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </Select>
      </div>
      <button className="btn" type="submit">
        {t.quick.submit}
        <ArrowRight size={18} weight="bold" aria-hidden="true" />
      </button>
    </form>
  )
}

export default function Hero({ ready }) {
  const { t } = useLang()
  const root = useRef(null)

  // entrada depois da abertura
  useLayoutEffect(() => {
    const q = gsap.utils.selector(root)
    if (reduced()) return
    gsap.set(q('.ln > span'), { yPercent: 110 })
    gsap.set(q('.hero-in'), { opacity: 0, y: 18 })
    gsap.set(q('.clock'), { opacity: 0 })
    gsap.set(q('.hero__media'), { scale: 1.18 })
  }, [])

  useEffect(() => {
    if (!ready) return
    const q = gsap.utils.selector(root)
    if (reduced()) return
    const tl = gsap.timeline({ defaults: { ease: 'expo.out' } })
    tl.to(q('.hero__media'), { scale: 1.06, duration: 2.6, ease: 'power3.out' }, 0)
      .to(q('.ln > span'), { yPercent: 0, duration: 1.4, stagger: 0.12 }, 0.35)
      .to(q('.hero-in'), { opacity: 1, y: 0, duration: 1.2, stagger: 0.1 }, 0.8)
      .to(q('.clock'), { opacity: 1, duration: 1.2 }, 1)
      .fromTo(
        q('.hero__sweep'),
        { backgroundPosition: '120% 0' },
        { backgroundPosition: '-20% 0', duration: 2.6, ease: 'power2.inOut' },
        0.5
      )
    return () => tl.kill()
  }, [ready])

  // scroll: barras de cinema recolhem, imagem recua
  useLayoutEffect(() => {
    if (reduced()) return
    const q = gsap.utils.selector(root)
    const ctx = gsap.context(() => {
      gsap
        .timeline({
          scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true },
        })
        .to(q('.hero__bar'), { scaleY: 0, ease: 'none' }, 0)
        .to(q('.hero__media'), { yPercent: 18, ease: 'none' }, 0)
        .to(q('.hero__content'), { yPercent: -18, opacity: 0, ease: 'none' }, 0)
    }, root)
    return () => ctx.revert()
  }, [])

  useEffect(() => {
    ScrollTrigger.refresh()
  }, [])

  return (
    <section className="hero" id="top" ref={root} aria-labelledby="hero-title">
      <div className="hero__media">
        <img
          src="/img/hero.webp"
          srcSet="/img/hero-m.webp 1100w, /img/hero.webp 2400w"
          sizes="100vw"
          alt=""
          fetchPriority="high"
        />
        <div className="hero__sweep" aria-hidden="true" />
      </div>
      <div className="hero__shade" aria-hidden="true" />
      <div className="hero__bar hero__bar--top" aria-hidden="true" />
      <div className="hero__bar hero__bar--bot" aria-hidden="true" />
      <Clock />
      <div className="hero__content">
        <div className="wrap">
          <h1 className="hero__title" id="hero-title">
            {t.hero.title.map((l) => (
              <span className="ln" key={l}>
                <span>{l}</span>
              </span>
            ))}
          </h1>
          <div className="hero__row">
            <p className="hero__sub hero-in">{t.hero.sub}</p>
            <div>
              <Quick />
              <p className="quick__hint hero-in">{t.quick.hint}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

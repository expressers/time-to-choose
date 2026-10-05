import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { gsap, reduced, getLenis } from '../motion.js'
import { useLang } from '../lang.jsx'

const KEY = 'ttc-intro-seen'

export function introSeen() {
  try {
    return sessionStorage.getItem(KEY) === '1' || new URLSearchParams(location.search).has('snap')
  } catch {
    return false
  }
}

export default function Intro({ onDone }) {
  const { t } = useLang()
  const root = useRef(null)
  const tl = useRef(null)
  const [gone, setGone] = useState(introSeen)

  useLayoutEffect(() => {
    if (gone) {
      onDone()
      return
    }
    const q = gsap.utils.selector(root)
    const finish = () => {
      try {
        sessionStorage.setItem(KEY, '1')
      } catch {}
      getLenis()?.start()
      setGone(true)
    }
    getLenis()?.stop()
    document.documentElement.style.overflow = 'hidden'

    if (reduced()) {
      tl.current = gsap
        .timeline({ onComplete: () => { document.documentElement.style.overflow = ''; finish() } })
        .set(q('.intro__car-reveal'), { scaleX: 0 })
        .from(q('.intro__mark'), { opacity: 0, duration: 0.5 })
        .to(root.current, { opacity: 0, duration: 0.5, delay: 0.6 })
        .add(onDone, '<')
      return () => tl.current?.kill()
    }

    tl.current = gsap
      .timeline({
        defaults: { ease: 'expo.out' },
        onComplete: finish,
      })
      .set(q('.intro__word'), { opacity: 0, y: 14, filter: 'blur(10px)' })
      .to(q('.intro__car-reveal'), { scaleX: 0, duration: 1.6, ease: 'power3.inOut' }, 0.25)
      .fromTo(q('.intro__glint'), { left: '-30%' }, { left: '110%', duration: 1.6, ease: 'power3.inOut' }, 0.25)
      .to(q('.intro__word'), { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.1 }, 1.15)
      .to(q('.intro__line'), { scaleX: 1, duration: 0.7, ease: 'power3.inOut' }, 2.75)
      .to(q('.intro__stage'), { opacity: 0, scale: 0.985, filter: 'blur(6px)', duration: 0.55, ease: 'power2.in' }, 2.6)
      .add(() => {
        document.documentElement.style.overflow = ''
        onDone()
      }, 3.3)
      .to(q('.intro__half--top'), { yPercent: -100, duration: 1.3, ease: 'expo.inOut' }, 3.3)
      .to(q('.intro__half--bot'), { yPercent: 100, duration: 1.3, ease: 'expo.inOut' }, 3.3)
      .to(q('.intro__line'), { opacity: 0, duration: 0.6 }, 3.45)
      .to(q('.intro__skip'), { opacity: 0, duration: 0.3 }, 2.6)

    const skip = (e) => {
      if (e.type === 'keydown' && !['Escape', 'Enter', ' '].includes(e.key)) return
      const cur = tl.current
      if (cur && cur.time() < 2.6) cur.seek(2.6)
    }
    window.addEventListener('keydown', skip)
    return () => {
      window.removeEventListener('keydown', skip)
      tl.current?.kill()
      document.documentElement.style.overflow = ''
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (gone) document.documentElement.style.overflow = ''
  }, [gone])

  if (gone) return null

  return (
    <div className="intro" ref={root} aria-hidden="true">
      <div className="intro__half intro__half--top" />
      <div className="intro__half intro__half--bot" />
      <div className="intro__line" />
      <div className="intro__stage">
        <div className="intro__mark">
          <div className="intro__car">
            <div className="intro__car-reveal" />
            <div className="intro__glint" />
          </div>
          <img className="intro__word" src="/brand/wordmark-gold.png" alt="" width="1396" height="288" />
        </div>
      </div>
      <button
        className="intro__skip"
        type="button"
        tabIndex={-1}
        onClick={() => tl.current && tl.current.time() < 2.6 && tl.current.seek(2.6)}
      >
        {t.intro.skip}
      </button>
    </div>
  )
}

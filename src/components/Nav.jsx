import { useEffect, useState } from 'react'
import { useLang } from '../lang.jsx'
import { scrollToId, getLenis } from '../motion.js'

export function LangSwitch() {
  const { lang, setLang } = useLang()
  return (
    <div className="lang" role="group" aria-label="Idioma / Language">
      <button type="button" aria-pressed={lang === 'pt'} onClick={() => setLang('pt')}>
        PT
      </button>
      <span aria-hidden="true" />
      <button type="button" aria-pressed={lang === 'en'} onClick={() => setLang('en')}>
        EN
      </button>
    </div>
  )
}

export default function Nav() {
  const { t } = useLang()
  const [solid, setSolid] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    let last = window.scrollY
    let raf = 0
    const read = () => {
      raf = 0
      const y = window.scrollY
      setSolid(y > window.innerHeight * 0.85)
      setHidden(y > 240 && y > last + 2)
      if (y < last - 2) setHidden(false)
      last = y
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(read)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const l = getLenis()
    if (open) l?.stop()
    else l?.start()
    const esc = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', esc)
    return () => window.removeEventListener('keydown', esc)
  }, [open])

  const items = [
    ['arrival', t.nav.arrival],
    ['services', t.nav.services],
    ['fleet', t.nav.fleet],
    ['stays', t.nav.stays],
    ['plan', t.nav.contact],
  ]

  const go = (id) => (e) => {
    e.preventDefault()
    setOpen(false)
    scrollToId(id)
  }

  return (
    <>
      <a className="skip" href="#arrival" onClick={go('arrival')}>
        {t.nav.skip}
      </a>
      <header className="nav" data-solid={solid || open} data-hidden={hidden && !open}>
        <div className="wrap nav__in">
          <a className="nav__logo" href="#top" onClick={go('top')} aria-label="Time To Choose Prime Transfer">
            <img src="/brand/wordmark-ivory.png" alt="Time To Choose Prime Transfer" width="1396" height="288" />
          </a>
          <nav aria-label="Principal">
            <ul className="nav__links">
              {items.map(([id, label]) => (
                <li key={id}>
                  <a href={`#${id}`} onClick={go(id)}>
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <LangSwitch />
          <a className="btn" href="#plan" onClick={go('plan')}>
            {t.nav.book}
          </a>
          <button
            className="nav__burger"
            type="button"
            aria-expanded={open}
            aria-controls="sheet"
            aria-label={open ? t.nav.close : t.nav.menu}
            onClick={() => setOpen((o) => !o)}
          >
            <i />
            <i />
          </button>
        </div>
      </header>
      <div className="sheet" id="sheet" data-open={open} aria-hidden={!open}>
        <ul>
          {items.map(([id, label]) => (
            <li key={id}>
              <a href={`#${id}`} onClick={go(id)} tabIndex={open ? 0 : -1}>
                {label}
              </a>
            </li>
          ))}
        </ul>
        <div className="sheet__foot">
          <LangSwitch />
          <a className="btn" href="#plan" onClick={go('plan')} tabIndex={open ? 0 : -1}>
            {t.nav.book}
          </a>
        </div>
      </div>
    </>
  )
}

import { ArrowUp } from '@phosphor-icons/react'
import { useLang } from '../lang.jsx'
import { CONTACT } from '../content.js'
import { scrollToId } from '../motion.js'

export default function Footer() {
  const { t } = useLang()
  const links = [
    ['arrival', t.nav.arrival],
    ['services', t.nav.services],
    ['fleet', t.nav.fleet],
    ['stays', t.nav.stays],
    ['plan', t.nav.contact],
  ]
  return (
    <footer className="foot">
      <div className="wrap">
        <div className="foot__grid">
          <div className="foot__brand">
            <img src="/brand/logo-gold.png" alt="Time To Choose Prime Transfer" width="1404" height="523" loading="lazy" />
            <p>{t.footer.tagline}</p>
          </div>
          <div>
            <h4>{t.footer.links}</h4>
            <ul>
              {links.map(([id, l]) => (
                <li key={id}>
                  <a
                    href={`#${id}`}
                    onClick={(e) => {
                      e.preventDefault()
                      scrollToId(id)
                    }}
                  >
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4>{t.footer.contact}</h4>
            <address>
              <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
              {CONTACT.phoneDisplay && (
                <>
                  <br />
                  <a href={`tel:${CONTACT.phoneDisplay.replace(/\s/g, '')}`}>{CONTACT.phoneDisplay}</a>
                </>
              )}
            </address>
          </div>
          <div>
            <h4>{t.footer.address}</h4>
            <address>
              <a href={CONTACT.mapsUrl} target="_blank" rel="noopener noreferrer">
                {CONTACT.address[0]}
                <br />
                {CONTACT.address[1]}
              </a>
            </address>
          </div>
        </div>
        <div className="foot__base">
          <span>© {new Date().getFullYear()} Time To Choose. {t.footer.rights}</span>
          <button type="button" onClick={() => scrollToId('top')}>
            {t.footer.top}
            <ArrowUp size={14} weight="bold" aria-hidden="true" />
          </button>
        </div>
      </div>
    </footer>
  )
}

import { CONTACT } from './content.js'

export function bookingUrl(t, data, lang = 'pt') {
  const m = t.msg
  const svc = t.services.find((s) => s.id === data.service)
  const lines = [
    m.hello,
    '',
    data.name && `${m.name}: ${data.name}`,
    data.contact && `${m.contact}: ${data.contact}`,
    svc && `${m.service}: ${svc.name}`,
    data.date && `${m.date}: ${formatDate(data.date, lang)}`,
    data.flight && `${m.flight}: ${data.flight.toUpperCase()}`,
    data.pax && `${m.pax}: ${data.pax}`,
    data.message && `${m.details}: ${data.message}`,
  ].filter((l) => l !== false && l !== undefined && l !== null)
  const body = lines.join('\n')
  if (CONTACT.whatsapp) {
    return `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(body)}`
  }
  const subject = `${m.subject}${svc ? ` · ${svc.name}` : ''}`
  return `mailto:${CONTACT.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}

function formatDate(v, lang) {
  try {
    const d = new Date(`${v}T12:00:00`)
    return d.toLocaleDateString(lang === 'pt' ? 'pt-PT' : 'en-GB', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  } catch {
    return v
  }
}

export function openBooking(url) {
  if (url.startsWith('mailto:')) window.location.href = url
  else window.open(url, '_blank', 'noopener')
}

export const today = () => {
  const d = new Date()
  const z = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${z(d.getMonth() + 1)}-${z(d.getDate())}`
}

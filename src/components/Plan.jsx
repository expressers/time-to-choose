import { useEffect, useId, useState } from 'react'
import { ArrowRight, CheckCircle, ArrowCounterClockwise } from '@phosphor-icons/react'
import { useLang } from '../lang.jsx'
import { CONTACT } from '../content.js'
import { bookingUrl, openBooking, today } from '../booking.js'
import { Select } from './Hero.jsx'
import Img from '../img.jsx'

const empty = { name: '', contact: '', service: 'transfer', date: '', flight: '', pax: '1', message: '' }

function Field({ id, label, hint, error, full, children }) {
  return (
    <div className={`field${full ? ' field--full' : ''}`} data-error={!!error}>
      <label htmlFor={id}>
        {label}
        {hint && <small>{hint}</small>}
      </label>
      <div className="field__wrap">{children}</div>
      {error && (
        <span className="field__err" id={`${id}-err`} role="alert">
          {error}
        </span>
      )}
    </div>
  )
}

export default function Plan({ service }) {
  const { t, lang } = useLang()
  const f = t.plan.fields
  const uid = useId()
  const [data, setData] = useState(empty)
  const [errors, setErrors] = useState({})
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (service) setData((d) => ({ ...d, service }))
  }, [service])

  const set = (k) => (e) => {
    setData((d) => ({ ...d, [k]: e.target.value }))
    if (errors[k]) setErrors((x) => ({ ...x, [k]: undefined }))
  }

  const validate = () => {
    const e = {}
    if (!data.name.trim()) e.name = t.plan.errors.name
    const c = data.contact.trim()
    const okMail = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(c)
    const okPhone = c.replace(/[^\d]/g, '').length >= 9
    if (!okMail && !okPhone) e.contact = t.plan.errors.contact
    if (!data.date) e.date = t.plan.errors.date
    return e
  }

  const submit = (ev) => {
    ev.preventDefault()
    const e = validate()
    setErrors(e)
    if (Object.keys(e).length) {
      document.getElementById(`${uid}-${Object.keys(e)[0]}`)?.focus()
      return
    }
    openBooking(bookingUrl(t, data, lang))
    setDone(true)
  }

  const id = (k) => `${uid}-${k}`
  const err = (k) => (errors[k] ? { 'aria-invalid': true, 'aria-describedby': `${id(k)}-err` } : {})

  return (
    <section className="plan" id="plan" aria-labelledby="plan-title">
      <div className="plan__bg" aria-hidden="true">
        <Img name="van" alt="" />
      </div>
      <div className="wrap plan__grid">
        <div className="plan__intro">
          <h2 className="h2 rv" id="plan-title">
            {t.plan.title}
          </h2>
          <p className="lede rv">{t.plan.text}</p>
          <div className="plan__direct rv">
            {t.plan.direct}
            <br />
            <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
            {CONTACT.phoneDisplay && (
              <>
                <br />
                <a href={`tel:${CONTACT.phoneDisplay.replace(/\s/g, '')}`}>{CONTACT.phoneDisplay}</a>
              </>
            )}
          </div>
        </div>
        <form className="form rv" onSubmit={submit} noValidate aria-live="polite">
          {done ? (
            <div className="done">
              <CheckCircle size={44} weight="light" aria-hidden="true" />
              <h3>{t.plan.done.title}</h3>
              <p>
                {t.plan.done.text} <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>.
              </p>
              <button
                type="button"
                className="link"
                onClick={() => {
                  setData(empty)
                  setDone(false)
                }}
              >
                <ArrowCounterClockwise size={16} weight="bold" aria-hidden="true" />
                <span>{t.plan.done.again}</span>
              </button>
            </div>
          ) : (
            <>
              <Field id={id('name')} label={f.name} error={errors.name}>
                <input id={id('name')} autoComplete="name" value={data.name} onChange={set('name')} {...err('name')} />
              </Field>
              <Field id={id('contact')} label={f.contact} error={errors.contact}>
                <input
                  id={id('contact')}
                  autoComplete="email"
                  inputMode="email"
                  value={data.contact}
                  onChange={set('contact')}
                  {...err('contact')}
                />
              </Field>
              <Field id={id('service')} label={f.service} full>
                <Select id={id('service')} value={data.service} onChange={set('service')}>
                  {t.services.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field id={id('date')} label={f.date} error={errors.date}>
                <input id={id('date')} type="date" min={today()} value={data.date} onChange={set('date')} {...err('date')} />
              </Field>
              <Field id={id('flight')} label={f.flight} hint={f.flightHint}>
                <input
                  id={id('flight')}
                  value={data.flight}
                  onChange={set('flight')}
                  placeholder="TP 289"
                  autoCapitalize="characters"
                />
              </Field>
              <Field id={id('pax')} label={f.pax} full>
                <Select id={id('pax')} value={data.pax} onChange={set('pax')}>
                  {['1', '2', '3', '4', '5', '6', '7', '8-15', '16+'].map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field id={id('message')} label={f.message} full>
                <textarea id={id('message')} rows={3} value={data.message} onChange={set('message')} placeholder={f.messagePh} />
              </Field>
              <div className="form__foot">
                <button className="btn" type="submit">
                  {t.plan.submit}
                  <ArrowRight size={18} weight="bold" aria-hidden="true" />
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </section>
  )
}

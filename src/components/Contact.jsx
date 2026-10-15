import { useEffect, useRef, useState } from 'react'
import { routes } from '../data/routes'
import { MONTHS } from '../lib/quote'
import { AlertIcon, CheckIcon } from './Icons'
import Photo from './Photo'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

const EMPTY = { name: '', email: '', phone: '', route: '', month: '', people: '2', message: '' }

function validate(values) {
  const errors = {}
  if (values.name.trim().length < 2) errors.name = 'Escribe tu nombre para saber cómo llamarte.'
  if (!values.email.trim()) errors.email = 'Necesitamos un correo para enviarte la cotización.'
  else if (!EMAIL_PATTERN.test(values.email.trim())) errors.email = 'Revisa el correo: debe tener la forma nombre@dominio.com.'
  if (values.phone && !/^[+\d\s()-]{6,20}$/.test(values.phone)) errors.phone = 'Usa solo números, espacios y el signo +.'
  const people = Number(values.people)
  if (!Number.isInteger(people) || people < 1 || people > 8) errors.people = 'Elige entre 1 y 8 personas.'
  if (values.message.trim().length < 10) errors.message = 'Cuéntanos un poco más (al menos 10 caracteres).'
  return errors
}

function upcomingMonthOptions() {
  const today = new Date()
  return Array.from({ length: 12 }, (_, i) => {
    const date = new Date(today.getFullYear(), today.getMonth() + 1 + i, 1)
    return { value: `${date.getFullYear()}-${date.getMonth() + 1}`, label: `${MONTHS[date.getMonth()]} ${date.getFullYear()}` }
  })
}

export default function Contact({ prefill }) {
  return (
    <section id="contacto" aria-labelledby="contact-title" className="relative bg-granite text-white">
      <div className="relative h-[22rem] overflow-hidden md:h-[28rem]">
        <Photo
          src="/images/cta-1600.webp"
          alt=""
          width={1600}
          height={1000}
          loading="lazy"
          className="absolute inset-0 size-full object-cover object-[50%_30%]"
        />
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-b from-granite/10 via-granite/30 to-granite" />
        <div className="container-page relative flex h-full flex-col justify-end pb-10">
          <h2 id="contact-title" className="section-title max-w-3xl">
            Las salidas de julio se llenan en marzo.
          </h2>
          <p className="mt-4 max-w-xl text-lg text-white/85">
            Escríbenos con tus fechas y te respondemos en menos de 24 horas con disponibilidad real y el
            nombre de tu guía.
          </p>
        </div>
      </div>

      <div className="container-page grid gap-12 pb-20 pt-6 md:pb-28 lg:grid-cols-12">
        <div className="space-y-6 text-white/80 lg:col-span-4">
          <dl className="space-y-5">
            <div>
              <dt className="text-sm text-white/60">Correo</dt>
              <dd><a className="text-lg text-white underline decoration-white/30 underline-offset-4 hover:decoration-white" href="mailto:reservas@example.com">reservas@example.com</a></dd>
            </div>
            <div>
              <dt className="text-sm text-white/60">Teléfono y WhatsApp (ficticio)</dt>
              <dd className="data-value text-lg text-white">+51 900 000 069</dd>
            </div>
            <div>
              <dt className="text-sm text-white/60">Oficina</dt>
              <dd>Jr. de la Cordillera 000, Huaraz (dirección ficticia)</dd>
            </div>
            <div>
              <dt className="text-sm text-white/60">Horario</dt>
              <dd>Lunes a sábado, de 8:00 a 19:00</dd>
            </div>
          </dl>
        </div>
        <div className="lg:col-span-8">
          <ContactForm key={prefill?.nonce ?? 'empty'} prefill={prefill} />
        </div>
      </div>
    </section>
  )
}

function ContactForm({ prefill }) {
  const [values, setValues] = useState(() => ({
    ...EMPTY,
    ...(prefill && { route: prefill.routeId, month: prefill.month, people: String(prefill.people), message: prefill.message }),
  }))
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [sent, setSent] = useState(null)
  const formRef = useRef(null)
  const confirmationRef = useRef(null)
  const months = upcomingMonthOptions()

  // Al confirmar, el foco pasa al mensaje para que lectores de pantalla lo anuncien.
  useEffect(() => {
    if (sent) confirmationRef.current?.focus()
  }, [sent])

  const update = (event) => {
    const { name, value } = event.target
    const next = { ...values, [name]: value }
    setValues(next)
    if (touched[name]) setErrors(validate(next))
  }

  const blur = (event) => {
    const { name } = event.target
    setTouched((current) => ({ ...current, [name]: true }))
    setErrors(validate(values))
  }

  const submit = (event) => {
    event.preventDefault()
    const found = validate(values)
    setErrors(found)
    setTouched(Object.fromEntries(Object.keys(EMPTY).map((key) => [key, true])))
    const firstInvalid = Object.keys(EMPTY).find((key) => found[key])
    if (firstInvalid) {
      formRef.current.elements[firstInvalid].focus()
      return
    }
    setSent({ name: values.name.trim().split(' ')[0], email: values.email.trim() })
  }

  if (sent) {
    return (
      <div className="pop-in rounded-[var(--radius-card)] bg-snow p-6 text-granite md:p-10">
        <span className="flex size-12 items-center justify-center rounded-full bg-lagoon text-white">
          <CheckIcon />
        </span>
        <h3 ref={confirmationRef} tabIndex={-1} className="mt-5 outline-none font-display text-4xl font-extrabold font-narrow">
          Consulta recibida, {sent.name}.
        </h3>
        <p className="mt-3 max-w-prose text-rock">
          Te escribiremos a <strong className="break-all text-granite">{sent.email}</strong> en menos de 24 horas con
          la disponibilidad y la cotización final. Este sitio es una demostración: el mensaje no se envió a
          ningún servidor.
        </p>
        <button type="button" onClick={() => { setSent(null); setValues(EMPTY); setTouched({}) }} className="btn btn-ghost mt-6 text-granite">
          Escribir otra consulta
        </button>
      </div>
    )
  }

  const field = (name) => ({
    id: `contact-${name}`,
    name,
    value: values[name],
    onChange: update,
    onBlur: blur,
    'aria-invalid': Boolean(touched[name] && errors[name]),
    'aria-describedby': touched[name] && errors[name] ? `contact-${name}-error` : undefined,
  })

  return (
    <form ref={formRef} onSubmit={submit} noValidate className="rounded-[var(--radius-card)] bg-snow p-6 text-granite md:p-10">
      <h3 className="font-display text-3xl font-extrabold font-narrow">Pide tu cotización o reserva</h3>
      <p className="mt-1 text-sm text-rock">Los campos marcados con * son obligatorios.</p>

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        <Field label="Nombre *" name="name" error={touched.name && errors.name}>
          <input {...field('name')} type="text" autoComplete="name" className="input" />
        </Field>
        <Field label="Correo *" name="email" error={touched.email && errors.email}>
          <input {...field('email')} type="email" autoComplete="email" inputMode="email" className="input" />
        </Field>
        <Field label="Teléfono o WhatsApp" name="phone" error={touched.phone && errors.phone}>
          <input {...field('phone')} type="tel" autoComplete="tel" className="input" />
        </Field>
        <Field label="Personas *" name="people" error={touched.people && errors.people}>
          <input {...field('people')} type="number" min="1" max="8" inputMode="numeric" className="input" />
        </Field>
        <Field label="Ruta" name="route">
          <select {...field('route')} className="input">
            <option value="">Aún no lo sé</option>
            {routes.map((route) => (
              <option key={route.id} value={route.id}>{route.name}</option>
            ))}
          </select>
        </Field>
        <Field label="Mes tentativo" name="month">
          <select {...field('month')} className="input">
            <option value="">Flexible</option>
            {months.map((month) => (
              <option key={month.value} value={month.value}>{month.label}</option>
            ))}
          </select>
        </Field>
        <Field label="Mensaje *" name="message" error={touched.message && errors.message} className="sm:col-span-2">
          <textarea {...field('message')} rows={5} className="input min-h-32 py-3" placeholder="Experiencia previa en altura, dudas, fechas exactas…" />
        </Field>
      </div>

      <button type="submit" className="btn btn-primary mt-8 w-full sm:w-auto">
        Enviar consulta
      </button>
    </form>
  )
}

function Field({ label, name, error, className = '', children }) {
  return (
    <div className={className}>
      <label htmlFor={`contact-${name}`} className="block text-[0.95rem] font-semibold">
        {label}
      </label>
      <div className="mt-2">{children}</div>
      {error && (
        <p id={`contact-${name}-error`} className="mt-2 flex items-start gap-1.5 text-sm font-medium text-danger">
          <AlertIcon className="mt-px size-4 shrink-0" />
          {error}
        </p>
      )}
    </div>
  )
}

import { useCallback, useEffect, useRef } from 'react'
import ElevationProfile from '../ElevationProfile'
import Photo from '../Photo'
import { CheckIcon, CloseIcon } from '../Icons'
import { REGIONS } from '../../data/routes'
import { formatNumber, plural } from '../../lib/quote'
import { DifficultyMeter, RouteFacts, SeasonStrip } from './RouteFacts'

const INCLUDED = [
  'Guía de montaña y asistente desde 6 personas',
  'Transporte privado desde Huaraz o Cusco',
  'Arrieros, mulas y cocinero en rutas de varios días',
  'Carpas de expedición, comedor y todas las comidas en ruta',
  'Oxímetro, botiquín de altura, oxígeno y teléfono satelital',
  'Entradas al parque nacional o al sitio arqueológico',
]

/**
 * Detalle de ruta en un <dialog> nativo: el navegador atrapa el foco,
 * cierra con Esc y deja el resto de la página inerte.
 */
export default function RouteDialog({ route, trigger, onClose, onQuote }) {
  const dialogRef = useRef(null)
  const closingRef = useRef(false)
  const afterCloseRef = useRef(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!route || !dialog || dialog.open) return

    closingRef.current = false
    afterCloseRef.current = null
    dialog.showModal()

    // La animación nace del botón que se pulsó (origen relativo al panel).
    if (trigger) {
      const rect = trigger.getBoundingClientRect()
      const panelLeft = (window.innerWidth - dialog.offsetWidth) / 2
      const panelTop = (window.innerHeight - dialog.offsetHeight) / 2
      dialog.style.setProperty('--origin-x', `${rect.left + rect.width / 2 - panelLeft}px`)
      dialog.style.setProperty('--origin-y', `${rect.top + rect.height / 2 - panelTop}px`)
    }
    document.documentElement.style.overflow = 'hidden'
    dialog.querySelector('[data-autofocus]')?.focus()
  }, [route, trigger])

  const finishClose = useCallback(() => {
    const dialog = dialogRef.current
    if (!dialog || !closingRef.current) return
    closingRef.current = false
    dialog.removeAttribute('data-closing')
    dialog.close()
  }, [])

  const requestClose = useCallback(() => {
    const dialog = dialogRef.current
    if (!dialog || closingRef.current) return
    closingRef.current = true
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reducedMotion) return finishClose()
    dialog.setAttribute('data-closing', '')
    dialog.addEventListener('animationend', finishClose, { once: true })
    window.setTimeout(finishClose, 250) // por si animationend no llega
  }, [finishClose])

  const handleClosed = () => {
    document.documentElement.style.overflow = ''
    onClose()
    if (afterCloseRef.current) afterCloseRef.current()
    else trigger?.focus()
  }

  const handleCancel = (event) => {
    event.preventDefault() // Esc: cerramos nosotros para animar la salida
    requestClose()
  }

  // Un clic fuera del panel cae sobre el propio <dialog> (el fondo).
  const handleBackdropClick = (event) => {
    if (event.target === dialogRef.current) requestClose()
  }

  return (
    // El clic en el fondo es un atajo de ratón; con teclado se cierra con Esc o el botón.
    // oxlint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
    <dialog
      ref={dialogRef}
      onClose={handleClosed}
      onCancel={handleCancel}
      onClick={handleBackdropClick}
      aria-labelledby="route-dialog-title"
      className="route-dialog m-auto h-[min(92dvh,60rem)] max-h-none w-[min(100%-1rem,52rem)] max-w-none overflow-hidden rounded-[var(--radius-card)] bg-snow p-0 text-granite shadow-2xl"
    >
      {route && (
        <>
          <button
            type="button"
            onClick={requestClose}
            data-autofocus
            className="absolute right-3 top-3 z-10 inline-flex size-11 items-center justify-center rounded-full bg-white/95 text-granite shadow-md transition-transform duration-150 active:scale-95"
            aria-label="Cerrar detalle de la ruta"
          >
            <CloseIcon />
          </button>
          <div className="h-full overflow-y-auto overscroll-contain">
            <div className="relative">
              <Photo
                src={route.image}
                alt=""
                width={800}
                height={569}
                fallbackLabel=""
                className="aspect-[16/9] max-h-72 w-full object-cover sm:aspect-[21/9]"
              />
              <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-granite/90 via-granite/30 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5 text-white md:p-8">
                <p className="text-sm text-white/85">
                  {REGIONS[route.region]}, {route.range}
                </p>
                <h2 id="route-dialog-title" className="mt-1 font-display text-5xl font-extrabold font-condensed md:text-6xl">
                  {route.name}
                </h2>
              </div>
            </div>

            <div className="space-y-10 p-5 md:p-8">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="max-w-xl text-lg text-granite/85">{route.summary}</p>
                <DifficultyMeter difficulty={route.difficulty} />
              </div>

              <RouteFacts route={route} />

              <section aria-labelledby="dialog-profile-title">
                <h3 id="dialog-profile-title" className="mb-8 font-display text-2xl font-extrabold font-narrow">
                  Perfil de elevación
                </h3>
                <ElevationProfile route={route} height={150} variant="detail" className="pl-8" />
              </section>

              <section aria-labelledby="dialog-itinerary-title">
                <h3 id="dialog-itinerary-title" className="font-display text-2xl font-extrabold font-narrow">
                  Itinerario {route.days > 1 ? `de ${route.days} días` : 'del día'}
                </h3>
                <ol className="mt-5 border-l-2 border-line">
                  {route.itinerary.map((day, index) => (
                    <li key={day.title} className="relative pb-7 pl-6 last:pb-0">
                      <span aria-hidden="true" className="absolute -left-[7px] top-1.5 size-3 rounded-full border-2 border-snow bg-lagoon" />
                      <p className="font-mono text-[0.8125rem] text-lagoon">Día {index + 1}</p>
                      <h4 className="mt-0.5 text-lg font-semibold leading-snug">{day.title}</h4>
                      <p className="mt-1 text-rock">{day.text}</p>
                      <p className="mt-2 flex flex-wrap gap-x-4 gap-y-1 font-mono text-[0.8125rem] text-granite/80 tabular">
                        {day.km > 0 && <span>{formatNumber(day.km)} km</span>}
                        {day.gain > 0 && <span>+{formatNumber(day.gain)} m</span>}
                        <span className="font-sans text-rock">{day.sleep}</span>
                      </p>
                    </li>
                  ))}
                </ol>
              </section>

              <div className="grid gap-10 md:grid-cols-2">
                <section aria-labelledby="dialog-season-title">
                  <h3 id="dialog-season-title" className="mb-4 font-display text-2xl font-extrabold font-narrow">
                    Cuándo ir
                  </h3>
                  <SeasonStrip route={route} />
                </section>
                <section aria-labelledby="dialog-included-title">
                  <h3 id="dialog-included-title" className="mb-4 font-display text-2xl font-extrabold font-narrow">
                    Qué incluye
                  </h3>
                  <ul className="space-y-2 text-[0.95rem]">
                    {INCLUDED.filter((item) => route.days > 1 || !item.includes('varios días')).map((item) => (
                      <li key={item} className="flex gap-2">
                        <CheckIcon className="mt-0.5 size-5 shrink-0 text-lagoon" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </section>
              </div>

              <div className="flex flex-col gap-4 rounded-[var(--radius-card)] bg-granite p-5 text-white sm:flex-row sm:items-center sm:justify-between md:p-6">
                <p>
                  Desde <span className="data-value text-xl">S/ {formatNumber(route.pricePerPerson)}</span> por persona,{' '}
                  {route.days} {plural(route.days, 'día', 'días')}.
                </p>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => {
                    afterCloseRef.current = () => onQuote(route.id)
                    requestClose()
                  }}
                >
                  Cotizar esta ruta
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </dialog>
  )
}

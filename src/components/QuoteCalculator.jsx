import { useId, useMemo, useState } from 'react'
import { getRoute, routes } from '../data/routes'
import {
  EXTRAS,
  MONTHS,
  calculateQuote,
  formatNumber,
  formatSoles,
  getSeason,
  isMonthAvailable,
  plural,
} from '../lib/quote'
import { AlertIcon, PlusIcon, SunIcon } from './Icons'

const MAX_PEOPLE = 8

// Los próximos 12 meses a partir del mes siguiente.
function upcomingMonths(today = new Date()) {
  return Array.from({ length: 12 }, (_, i) => {
    const date = new Date(today.getFullYear(), today.getMonth() + 1 + i, 1)
    return { key: `${date.getFullYear()}-${date.getMonth() + 1}`, month: date.getMonth() + 1, year: date.getFullYear() }
  })
}

export default function QuoteCalculator({ routeId, onRouteChange, onRequest }) {
  const months = useMemo(() => upcomingMonths(), [])
  const [monthKey, setMonthKey] = useState(() => months.find((m) => getSeason(m.month) === 'dry').key)
  const [people, setPeople] = useState(2)
  const [extras, setExtras] = useState({ gear: false, porter: false, acclimatization: false })
  const ids = { route: 'quote-route', monthHelp: useId() }

  const route = getRoute(routeId)
  const selected = months.find((m) => m.key === monthKey)
  const available = isMonthAvailable(route, selected.month)
  const quote = available ? calculateQuote({ route, month: selected.month, people, extras }) : null

  const toggleExtra = (key) => setExtras((current) => ({ ...current, [key]: !current[key] }))

  const requestQuote = () => {
    const chosenExtras = Object.keys(extras)
      .filter((key) => extras[key] && !(EXTRAS[key].multiDayOnly && route.days === 1))
      .map((key) => EXTRAS[key].label.toLowerCase())
    const summary = [
      `Hola, quiero reservar ${route.name} en ${MONTHS[selected.month - 1].toLowerCase()} de ${selected.year} para ${people} ${plural(people, 'persona', 'personas')}.`,
      chosenExtras.length ? `Extras: ${chosenExtras.join(', ')}.` : '',
      `Total estimado: ${formatSoles(quote.total)}.`,
    ]
      .filter(Boolean)
      .join(' ')
    onRequest({ routeId: route.id, month: selected.key, people, message: summary })
  }

  return (
    <section id="cotizar" aria-labelledby="quote-title" className="py-20 md:py-28">
      <div className="container-page">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <h2 id="quote-title" className="section-title text-granite lg:col-span-7">
            Calcula tu expedición.
          </h2>
          <p className="max-w-md text-lg text-rock lg:col-span-5">
            Precio estimado al instante, con todo el desglose. Lo confirmamos por escrito en menos de 24
            horas y sin compromiso.
          </p>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-12 lg:gap-12">
          <form className="space-y-10 lg:col-span-7" onSubmit={(event) => event.preventDefault()}>
            <div>
              <label htmlFor={ids.route} className="block font-semibold">
                Ruta
              </label>
              <select
                id={ids.route}
                value={routeId}
                onChange={(event) => onRouteChange(event.target.value)}
                className="mt-2 block min-h-12 w-full rounded-[var(--radius-card)] border border-line bg-white px-4 text-base"
              >
                {routes.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}, {r.days} {plural(r.days, 'día', 'días')}
                  </option>
                ))}
              </select>
            </div>

            <fieldset aria-describedby={ids.monthHelp}>
              <legend className="font-semibold">Mes de salida</legend>
              <p id={ids.monthHelp} className="mt-1 flex items-center gap-1.5 text-sm text-rock">
                <SunIcon className="size-4 text-flare-deep" />
                De mayo a septiembre es temporada seca: cielos despejados y noches frías.
              </p>
              <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
                {months.map((m) => (
                  <MonthOption
                    key={m.key}
                    option={m}
                    name="quote-month"
                    checked={m.key === monthKey}
                    available={isMonthAvailable(route, m.month)}
                    onChange={() => setMonthKey(m.key)}
                  />
                ))}
              </div>
            </fieldset>

            <fieldset>
              <legend className="font-semibold">Personas</legend>
              <div className="mt-2 flex items-center gap-4">
                <StepButton label="Quitar una persona" disabled={people <= 1} onClick={() => setPeople(people - 1)}>
                  <span aria-hidden="true" className="block h-0.5 w-4 rounded bg-current" />
                </StepButton>
                <output aria-live="polite" className="min-w-24 text-center">
                  <span className="data-value text-3xl">{people}</span>{' '}
                  <span className="text-rock">{plural(people, 'persona', 'personas')}</span>
                </output>
                <StepButton label="Añadir una persona" disabled={people >= MAX_PEOPLE} onClick={() => setPeople(people + 1)}>
                  <PlusIcon className="size-5" />
                </StepButton>
              </div>
              <p className="mt-2 text-sm text-rock">
                {people >= MAX_PEOPLE
                  ? 'Ocho es nuestro máximo por grupo. Para más personas armamos dos grupos con guías distintos.'
                  : 'Desde 4 personas el precio por persona baja.'}
              </p>
            </fieldset>

            <fieldset>
              <legend className="font-semibold">Extras</legend>
              <div className="mt-3 space-y-2">
                {Object.entries(EXTRAS).map(([key, extra]) => {
                  const disabled = extra.multiDayOnly && route.days === 1
                  const price = extra.pricePerPersonDay
                    ? `S/ ${extra.pricePerPersonDay} por persona y día`
                    : `S/ ${extra.pricePerPerson} por persona`
                  return (
                    <label
                      key={key}
                      className={`flex gap-3 rounded-[var(--radius-card)] border bg-white p-4 transition-colors duration-150 ${
                        disabled
                          ? 'cursor-not-allowed border-line/60 opacity-60'
                          : extras[key]
                            ? 'cursor-pointer border-lagoon ring-1 ring-lagoon'
                            : 'cursor-pointer border-line hover:border-granite/40'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={extras[key] && !disabled}
                        disabled={disabled}
                        onChange={() => toggleExtra(key)}
                        className="mt-1 size-5 shrink-0 accent-[var(--color-lagoon)]"
                      />
                      <span className="flex-1">
                        <span className="flex flex-wrap justify-between gap-x-4">
                          <span className="font-medium">{extra.label}</span>
                          <span className="font-mono text-sm text-rock">{price}</span>
                        </span>
                        <span className="mt-0.5 block text-sm text-rock">
                          {disabled ? 'No aplica a rutas de un día.' : extra.detail}
                        </span>
                      </span>
                    </label>
                  )
                })}
              </div>
            </fieldset>

            {/* En móvil el desglose queda lejos: este resumen acompaña mientras eliges. */}
            <div className="sticky bottom-3 z-10 flex items-center justify-between gap-4 rounded-full bg-granite py-2 pl-5 pr-2 text-white shadow-[var(--shadow-lift)] lg:hidden">
              <p className="text-sm">
                {quote ? (
                  <>
                    Total <span className="data-value ml-1 text-lg">{formatSoles(quote.total)}</span>
                  </>
                ) : (
                  'Elige otro mes'
                )}
              </p>
              <a href="#quote-summary-title" className="btn btn-primary min-h-11 px-4 text-sm">
                Ver desglose
              </a>
            </div>
          </form>

          <aside aria-labelledby="quote-summary-title" className="lg:col-span-5">
            <div className="rounded-[var(--radius-card)] bg-granite p-6 text-white shadow-[var(--shadow-lift)] md:p-8 lg:sticky lg:top-24">
              <h3 id="quote-summary-title" className="font-display text-3xl font-extrabold font-narrow">
                Tu estimado
              </h3>
              <p className="mt-1 text-sm text-white/70">
                {route.name}, {MONTHS[selected.month - 1].toLowerCase()} de {selected.year}
              </p>

              {quote ? (
                <QuoteBreakdown quote={quote} people={people} onRequest={requestQuote} />
              ) : (
                <p role="alert" className="pop-in mt-6 flex gap-3 rounded-[var(--radius-card)] bg-white/10 p-4 text-white/90">
                  <AlertIcon className="size-6 shrink-0 text-flare" />
                  <span>
                    {route.name} no tiene salidas en {MONTHS[selected.month - 1].toLowerCase()}: con las
                    lluvias los pasos altos se cubren de nieve. Elige un mes entre abril y noviembre.
                  </span>
                </p>
              )}
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}

function QuoteBreakdown({ quote, people, onRequest }) {
  return (
    <>
      <ul className="mt-6 space-y-3 border-y border-white/15 py-5 text-[0.95rem]">
        {quote.lines.map((line) => (
          <li key={line.label} className="flex items-baseline justify-between gap-4">
            <span>
              {line.label}
              {line.detail && <span className="block text-sm text-white/60">{line.detail}</span>}
            </span>
            <span className="data-value whitespace-nowrap">{formatSoles(line.amount)}</span>
          </li>
        ))}
      </ul>
      <div className="mt-5 flex items-end justify-between gap-4" aria-live="polite">
        <p className="text-white/80">Total</p>
        <p className="text-right">
          <span className="data-value block text-4xl md:text-5xl">{formatSoles(quote.total)}</span>
          <span className="data-value text-sm text-white/70">≈ US$ {formatNumber(quote.totalUsd)}</span>
        </p>
      </div>
      <p className="mt-4 text-sm text-white/70">
        {people > 1 && <>S/ {formatNumber(quote.perPerson)} por persona. </>}
        Reservas con {formatSoles(quote.deposit)} (30 %). Dólares al tipo de cambio referencial de S/ 3.75.
      </p>
      <button type="button" onClick={onRequest} className="btn btn-primary mt-6 w-full">
        Pedir esta cotización
      </button>
    </>
  )
}

function MonthOption({ option, name, checked, available, onChange }) {
  const dry = getSeason(option.month) === 'dry'
  const monthName = MONTHS[option.month - 1]
  return (
    <label
      className={`relative flex min-h-14 cursor-pointer flex-col items-center justify-center rounded-[var(--radius-card)] border text-center transition-colors duration-150 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-lagoon ${
        checked
          ? 'border-granite bg-granite text-white'
          : available
            ? dry
              ? 'border-lagoon/40 bg-ice text-granite hover:border-lagoon'
              : 'border-line bg-white text-granite hover:border-granite/40'
            : 'border-line bg-[repeating-linear-gradient(135deg,var(--color-ice)_0_3px,white_3px_8px)] text-rock'
      }`}
    >
      <input
        type="radio"
        name={name}
        checked={checked}
        onChange={onChange}
        aria-label={`${monthName} de ${option.year}${dry ? ', temporada seca' : ''}${available ? '' : ', sin salidas para esta ruta'}`}
        className="sr-only"
      />
      <span aria-hidden="true" className="text-[0.95rem] font-semibold">{monthName.slice(0, 3)}</span>
      <span aria-hidden="true" className={`font-mono text-[0.6875rem] ${checked ? 'text-white/70' : 'text-rock'}`}>{option.year}</span>
      {dry && (
        <span aria-hidden="true" className={`absolute right-1.5 top-1.5 size-1.5 rounded-full ${checked ? 'bg-flare' : 'bg-lagoon'}`} />
      )}
    </label>
  )
}

function StepButton({ label, disabled, onClick, children }) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="inline-flex size-12 items-center justify-center rounded-full border border-line bg-white text-granite transition-transform duration-150 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
    >
      {children}
    </button>
  )
}

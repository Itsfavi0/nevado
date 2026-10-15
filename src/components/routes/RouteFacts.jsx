import { DIFFICULTIES } from '../../data/routes'
import { MONTHS, formatMonthRange, formatNumber, plural } from '../../lib/quote'

export function DifficultyMeter({ difficulty, tone = 'light' }) {
  const { label, level } = DIFFICULTIES[difficulty]
  const off = tone === 'dark' ? 'bg-white/25' : 'bg-line'
  return (
    <span className="inline-flex items-center gap-2 text-sm font-medium">
      <span aria-hidden="true" className="flex items-end gap-[3px]">
        {[1, 2, 3].map((bar) => (
          <span
            key={bar}
            className={`w-[5px] rounded-[1px] ${bar <= level ? 'bg-flare' : off}`}
            style={{ height: 6 + bar * 4 }}
          />
        ))}
      </span>
      {label}
    </span>
  )
}

/** Lista de datos técnicos (dl) reutilizada en tarjeta y detalle. */
export function RouteFacts({ route, columns = 'grid-cols-3 sm:grid-cols-5', className = '' }) {
  const facts = [
    { label: 'Duración', value: `${route.days} ${plural(route.days, 'día', 'días')}` },
    { label: 'Distancia', value: `${formatNumber(route.distanceKm)} km` },
    { label: 'Altitud máx.', value: `${formatNumber(route.maxAltitude)} m` },
    { label: 'Desnivel +', value: `${formatNumber(route.gain)} m` },
    { label: 'Mejor época', value: formatMonthRange(route.bestMonths) },
  ]
  return (
    <dl className={`grid gap-x-4 gap-y-3 ${columns} ${className}`}>
      {facts.map((fact) => (
        <div key={fact.label} className="min-w-0">
          <dt className="data-label">{fact.label}</dt>
          <dd className="data-value mt-0.5 text-[0.95rem] text-granite">{fact.value}</dd>
        </div>
      ))}
    </dl>
  )
}

/** Tira de 12 meses: temporada recomendada, posible o cerrada. */
export function SeasonStrip({ route }) {
  return (
    <div>
      <ol className="grid grid-cols-12 gap-1" aria-label="Temporada por mes">
        {MONTHS.map((name, index) => {
          const month = index + 1
          const best = route.bestMonths.includes(month)
          const closed = !route.rainySeason && (month <= 3 || month === 12)
          const status = best ? 'recomendada' : closed ? 'sin salidas' : 'posible'
          return (
            <li key={name} className="text-center">
              <span
                aria-hidden="true"
                className={`block h-7 rounded-[2px] ${
                  best ? 'bg-lagoon' : closed ? 'bg-[repeating-linear-gradient(135deg,var(--color-line)_0_2px,transparent_2px_6px)]' : 'bg-ice'
                }`}
              />
              <span className="mt-1 block font-mono text-[0.625rem] uppercase text-rock">
                {name.slice(0, 1)}
                <span className="sr-only">{name.slice(1)}: {status}</span>
              </span>
            </li>
          )
        })}
      </ol>
      <p className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-[0.8125rem] text-rock">
        <span className="inline-flex items-center gap-1.5"><span className="size-3 rounded-[2px] bg-lagoon" aria-hidden="true" /> Recomendada</span>
        <span className="inline-flex items-center gap-1.5"><span className="size-3 rounded-[2px] bg-ice ring-1 ring-line" aria-hidden="true" /> Posible, con lluvias</span>
        {!route.rainySeason && (
          <span className="inline-flex items-center gap-1.5"><span className="size-3 rounded-[2px] bg-[repeating-linear-gradient(135deg,var(--color-line)_0_2px,transparent_2px_6px)] ring-1 ring-line" aria-hidden="true" /> Sin salidas</span>
        )}
      </p>
    </div>
  )
}

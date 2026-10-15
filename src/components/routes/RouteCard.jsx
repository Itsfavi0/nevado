import ElevationProfile from '../ElevationProfile'
import Photo from '../Photo'
import { REGIONS } from '../../data/routes'
import { formatNumber } from '../../lib/quote'
import { DifficultyMeter, RouteFacts } from './RouteFacts'

export default function RouteCard({ route, index, onOpen, onQuote }) {
  const titleId = `route-${route.id}-title`

  return (
    <article
      aria-labelledby={titleId}
      className="card-enter group flex flex-col overflow-hidden rounded-[var(--radius-card)] bg-white shadow-[var(--shadow-lift)] ring-1 ring-line/60"
      style={{ '--i': index }}
    >
      <div className="relative overflow-hidden">
        <Photo
          src={route.image}
          alt={route.imageAlt}
          width={800}
          height={569}
          loading="lazy"
          fallbackLabel={route.name}
          className="aspect-[16/9] w-full object-cover transition-transform duration-500 ease-[var(--ease-out)] group-hover:scale-[1.02]"
        />
        <p className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-[0.8125rem] font-medium text-granite backdrop-blur">
          {REGIONS[route.region]}, {route.range}
        </p>
      </div>

      <div className="flex flex-1 flex-col p-5 md:p-6">
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <h3 id={titleId} className="font-display text-[2rem] font-extrabold font-condensed text-granite">
            {route.name}
          </h3>
          <DifficultyMeter difficulty={route.difficulty} />
        </div>
        <p className="mt-2 text-[0.975rem] text-rock">{route.summary}</p>

        <ElevationProfile route={route} height={96} className="mt-6 pl-8" />

        <RouteFacts route={route} columns="grid-cols-3 xl:grid-cols-5" className="mt-5 border-t border-line pt-4" />

        <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-6">
          <p className="text-sm text-rock">
            Desde <span className="data-value text-base text-granite">S/ {formatNumber(route.pricePerPerson)}</span> por persona
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              className="btn btn-ghost min-h-11 px-4 text-sm text-lagoon"
              onClick={(event) => onQuote(route.id, event)}
              aria-label={`Cotizar ${route.name}`}
            >
              Cotizar
            </button>
            <button
              type="button"
              className="btn btn-secondary min-h-11 px-4 text-sm"
              onClick={(event) => onOpen(route, event.currentTarget)}
              aria-haspopup="dialog"
            >
              Ver itinerario
              <span className="sr-only"> de {route.name}</span>
            </button>
          </div>
        </div>
      </div>
    </article>
  )
}

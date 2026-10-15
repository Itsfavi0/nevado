import { useMemo, useState } from 'react'
import { DIFFICULTIES, REGIONS, routes } from '../../data/routes'
import { plural } from '../../lib/quote'
import RouteCard from './RouteCard'
import RouteDialog from './RouteDialog'

const DURATIONS = {
  short: { label: '1 a 3 días', test: (days) => days <= 3 },
  medium: { label: '4 a 6 días', test: (days) => days >= 4 && days <= 6 },
  long: { label: '7 días o más', test: (days) => days >= 7 },
}

const FILTER_GROUPS = [
  { key: 'region', legend: 'Región', options: REGIONS },
  {
    key: 'difficulty',
    legend: 'Dificultad',
    options: Object.fromEntries(Object.entries(DIFFICULTIES).map(([id, d]) => [id, d.label])),
  },
  {
    key: 'duration',
    legend: 'Duración',
    options: Object.fromEntries(Object.entries(DURATIONS).map(([id, d]) => [id, d.label])),
  },
]

const NO_FILTERS = { region: 'all', difficulty: 'all', duration: 'all' }

export default function RouteExplorer({ onQuote }) {
  const [filters, setFilters] = useState(NO_FILTERS)
  const [openRoute, setOpenRoute] = useState(null)
  const [trigger, setTrigger] = useState(null)

  const visible = useMemo(
    () =>
      routes.filter(
        (route) =>
          (filters.region === 'all' || route.region === filters.region) &&
          (filters.difficulty === 'all' || route.difficulty === filters.difficulty) &&
          (filters.duration === 'all' || DURATIONS[filters.duration].test(route.days)),
      ),
    [filters],
  )
  const filterKey = Object.values(filters).join('-')
  const hasFilters = filterKey !== Object.values(NO_FILTERS).join('-')

  const setFilter = (key, value) => setFilters((current) => ({ ...current, [key]: value }))

  return (
    <section id="rutas" aria-labelledby="routes-title" className="relative bg-ice/60 py-20 md:py-28">
      <div className="container-page">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <h2 id="routes-title" className="section-title text-granite lg:col-span-7">
            Ocho rutas, de un día a diez.
          </h2>
          <p className="max-w-md text-lg text-rock lg:col-span-5">
            Todos los perfiles usan la misma escala de altura: compáralos y elige la que se ajuste a tu
            experiencia. Si dudas, empieza por Laguna 69.
          </p>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-y border-line py-5 xl:flex-row xl:gap-10">
          {FILTER_GROUPS.map((group) => (
            <FilterGroup
              key={group.key}
              legend={group.legend}
              options={group.options}
              value={filters[group.key]}
              onChange={(value) => setFilter(group.key, value)}
            />
          ))}
        </div>

        <div className="mt-6 flex min-h-11 items-center justify-between gap-4">
          <p aria-live="polite" className="text-rock">
            <span className="data-value text-granite">{visible.length}</span>{' '}
            {plural(visible.length, 'ruta coincide', 'rutas coinciden')}
          </p>
          {hasFilters && (
            <button
              type="button"
              onClick={() => setFilters(NO_FILTERS)}
              className="min-h-11 rounded-full px-3 text-sm font-semibold text-lagoon underline underline-offset-4"
            >
              Quitar filtros
            </button>
          )}
        </div>

        {visible.length > 0 ? (
          <div className="mt-4 grid gap-6 md:grid-cols-2 md:gap-8">
            {visible.map((route, index) => (
              <RouteCard
                key={`${route.id}-${filterKey}`}
                route={route}
                index={index}
                onOpen={(r, button) => {
                  setTrigger(button)
                  setOpenRoute(r)
                }}
                onQuote={onQuote}
              />
            ))}
          </div>
        ) : (
          <div className="pop-in mt-4 rounded-[var(--radius-card)] border border-dashed border-line bg-white/70 px-6 py-12 text-center">
            <p className="font-display text-3xl font-extrabold font-narrow text-granite">
              Ninguna ruta cumple los tres filtros.
            </p>
            <p className="mx-auto mt-2 max-w-md text-rock">
              Las rutas largas solo salen en Áncash y Cusco con dificultad exigente o mayor. Prueba otra
              duración o escríbenos y armamos una a medida.
            </p>
            <button type="button" onClick={() => setFilters(NO_FILTERS)} className="btn btn-secondary mt-6">
              Ver las ocho rutas
            </button>
          </div>
        )}
      </div>

      <RouteDialog
        route={openRoute}
        trigger={trigger}
        onClose={() => setOpenRoute(null)}
        onQuote={onQuote}
      />
    </section>
  )
}

function FilterGroup({ legend, options, value, onChange }) {
  const entries = [['all', 'Todas'], ...Object.entries(options)]
  return (
    <fieldset className="min-w-0">
      <legend className="mb-2 text-sm font-semibold text-granite md:float-left md:mb-0 md:w-24 md:pt-3 xl:float-none xl:mb-2 xl:w-auto xl:pt-0">{legend}</legend>
      <div className="flex flex-wrap gap-1.5">
        {entries.map(([id, label]) => {
          const selected = value === id
          return (
            <button
              key={id}
              type="button"
              aria-pressed={selected}
              onClick={() => onChange(id)}
              className={`min-h-11 rounded-full border px-3.5 text-sm font-medium transition-colors duration-150 ${
                selected
                  ? 'border-granite bg-granite text-white'
                  : 'border-line bg-white text-granite hover:border-granite/50'
              }`}
            >
              {id === 'all' ? <><span>{label}</span><span className="sr-only"> ({legend.toLowerCase()})</span></> : label}
            </button>
          )
        })}
      </div>
    </fieldset>
  )
}

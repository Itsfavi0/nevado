import { useId } from 'react'
import { useElementWidth } from '../hooks/useElementWidth'
import { useInView } from '../hooks/useInView'
import { formatNumber } from '../lib/quote'

// Todas las tarjetas comparten la misma escala vertical: así se compara
// la altura de las rutas de un vistazo.
const ALT_MIN = 1400
const ALT_MAX = 5300
const GRID = [2000, 3000, 4000, 5000]

export default function ElevationProfile({
  route,
  height = 120,
  variant = 'card', // 'card' | 'detail' | 'hero'
  tone = 'light', // 'light' | 'dark'
  scale = 'shared', // 'shared': misma escala para todas | 'route': ajustada a la ruta
  className = '',
}) {
  const [ref, inView] = useInView({ threshold: 0.4 })
  // El viewBox usa el ancho real: el trazo no se deforma y la animación
  // de stroke-dashoffset funciona igual en todos los tamaños.
  const width = useElementWidth(ref)
  const gradientId = `profile-${useId().replace(/[^a-zA-Z0-9]/g, '')}`
  const { profile, waypoints = [], maxAltitude, distanceKm } = route

  const x = (km) => (km / distanceKm) * width
  const altitudes = profile.map(([, alt]) => alt)
  const [low, high] =
    scale === 'route'
      ? [Math.min(...altitudes) - 400, Math.max(...altitudes) + 150]
      : [ALT_MIN, ALT_MAX]
  const y = (alt) => height - ((alt - low) / (high - low)) * height
  const points = profile.map(([km, alt]) => [x(km), y(alt)])
  const line = smoothPath(points)
  const area = `${line} L${width} ${height} L0 ${height} Z`

  const summit = profile.reduce((top, point) => (point[1] > top[1] ? point : top))
  const summitName = waypoints.find((w) => w.km === summit[0])?.label
  const drawn = inView ? 'is-drawn' : ''

  const colors =
    tone === 'dark'
      ? { line: '#ffffff', fill: '#ffffff', grid: 'rgb(255 255 255 / 0.22)', text: 'text-white/80' }
      : { line: 'var(--color-lagoon)', fill: 'var(--color-lagoon)', grid: 'var(--color-line)', text: 'text-rock' }

  const showGrid = variant !== 'hero'
  const showWaypoints = variant !== 'card'

  return (
    <figure className={className}>
      <div ref={ref} className="relative">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="block w-full overflow-visible"
          style={{ height }}
          aria-hidden="true"
        >
          <defs>
            <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" stopColor={colors.fill} stopOpacity={tone === 'dark' ? 0.28 : 0.2} />
              <stop offset="1" stopColor={colors.fill} stopOpacity="0" />
            </linearGradient>
          </defs>
          {showGrid &&
            GRID.map((alt) => (
              <line
                key={alt}
                x1="0"
                x2={width}
                y1={y(alt)}
                y2={y(alt)}
                stroke={colors.grid}
                strokeDasharray="2 4"
              />
            ))}
          <path d={area} fill={`url(#${gradientId})`} className={`profile-area ${drawn}`} />
          <path
            d={line}
            fill="none"
            stroke={colors.line}
            strokeWidth={variant === 'card' ? 2 : 2.5}
            strokeLinejoin="round"
            pathLength="1"
            className={`profile-line ${drawn}`}
          />
        </svg>

        <p className="sr-only">
          Perfil de elevación de {route.name}: {formatNumber(distanceKm)} km, punto más alto{' '}
          {formatNumber(maxAltitude)} m{summitName ? ` en ${summitName}` : ''}.
        </p>
        <div aria-hidden="true" className={`pointer-events-none absolute inset-0 font-mono text-[0.6875rem] ${colors.text}`}>
          {showGrid &&
            GRID.map((alt) => (
              <span key={alt} className="absolute right-full -translate-y-1/2 pr-1.5 tabular" style={{ top: y(alt) }}>
                {formatNumber(alt)}
              </span>
            ))}

          <Marker
            left={(x(summit[0]) / width) * 100}
            top={y(summit[1])}
            tone={tone}
            delay={1100}
            className={drawn}
          >
            <strong className={`font-medium ${tone === 'dark' ? 'text-white' : 'text-granite'}`}>
              {formatNumber(summit[1])} m
            </strong>
            {variant !== 'card' && summitName && <span className="block">{summitName}</span>}
          </Marker>
        </div>
      </div>

      {showWaypoints && (
        <figcaption className={`relative mt-2 h-10 ${variant === 'hero' ? 'hidden sm:block' : ''}`}>
          <span className="sr-only">Puntos de paso: </span>
          {waypoints
            .filter((w) => w.km !== summit[0])
            .map((w, index, list) => {
              const left = (x(w.km) / width) * 100
              const align = left < 8 ? 'translate-x-0' : left > 92 ? '-translate-x-full' : '-translate-x-1/2'
              return (
                <span
                  key={`${w.label}-${w.km}`}
                  className={`absolute whitespace-nowrap font-mono text-[0.6875rem] ${colors.text} ${align} ${
                    index % 2 === 1 && list.length > 2 ? 'top-5' : 'top-0'
                  }`}
                  style={{ left: `${left}%` }}
                >
                  {w.label}
                  <span className="sr-only">, km {w.km}{index < list.length - 1 ? ';' : '.'}</span>
                </span>
              )
            })}
        </figcaption>
      )}
    </figure>
  )
}

function Marker({ left, top, tone, delay, className, children }) {
  const align = left > 80 ? 'right-0 text-right' : 'left-0'
  return (
    <div className="absolute" style={{ left: `${left}%`, top }}>
      <span
        className={`profile-marker absolute -left-[4px] -top-[4px] block size-2 rounded-full ring-2 ${
          tone === 'dark' ? 'bg-white ring-granite/40' : 'bg-flare ring-snow'
        } ${className}`}
        style={{ '--marker-delay': `${delay}ms` }}
      />
      <span
        className={`profile-marker absolute bottom-2 whitespace-nowrap leading-tight ${align} ${
          tone === 'dark' ? 'rounded-sm bg-granite/75 px-1.5 py-0.5' : ''
        } ${className}`}
        style={{ '--marker-delay': `${delay}ms` }}
      >
        {children}
      </span>
    </div>
  )
}

// Curva monótona (Fritsch–Carlson): suave y sin "picos fantasma" por encima
// del punto más alto real.
function smoothPath(points) {
  const n = points.length
  if (n < 2) return ''
  const dx = []
  const slopes = []
  for (let i = 0; i < n - 1; i++) {
    dx[i] = points[i + 1][0] - points[i][0]
    slopes[i] = (points[i + 1][1] - points[i][1]) / dx[i]
  }
  const tangents = [slopes[0]]
  for (let i = 1; i < n - 1; i++) {
    tangents[i] = slopes[i - 1] * slopes[i] <= 0 ? 0 : (slopes[i - 1] + slopes[i]) / 2
  }
  tangents[n - 1] = slopes[n - 2]

  let d = `M${points[0][0].toFixed(1)} ${points[0][1].toFixed(1)}`
  for (let i = 0; i < n - 1; i++) {
    const [x0, y0] = points[i]
    const [x1, y1] = points[i + 1]
    const h = dx[i] / 3
    d += ` C${(x0 + h).toFixed(1)} ${(y0 + tangents[i] * h).toFixed(1)} ${(x1 - h).toFixed(1)} ${(
      y1 - tangents[i + 1] * h
    ).toFixed(1)} ${x1.toFixed(1)} ${y1.toFixed(1)}`
  }
  return d
}

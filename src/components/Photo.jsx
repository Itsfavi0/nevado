import { useState } from 'react'

/**
 * Imagen con respaldo: si no hay foto o no carga, muestra un fondo de curvas
 * de nivel del mismo tamaño, así el diseño no se rompe.
 */
export default function Photo({ src, alt = '', className = '', fallbackLabel, ...props }) {
  const [failed, setFailed] = useState(false)

  if (!src || failed) {
    return (
      <div className={`relative grid place-items-center overflow-hidden bg-granite ${className}`} role={alt ? 'img' : undefined} aria-label={alt || undefined}>
        <div aria-hidden="true" className="topo absolute inset-0 bg-lagoon-bright/35" />
        {fallbackLabel && (
          <span aria-hidden="true" className="relative font-display text-3xl font-extrabold text-white/90 font-condensed">
            {fallbackLabel}
          </span>
        )}
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      decoding="async"
      onError={() => setFailed(true)}
      className={className}
      {...props}
    />
  )
}

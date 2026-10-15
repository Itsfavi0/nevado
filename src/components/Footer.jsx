import Logo from './Logo'

const COLUMNS = [
  {
    title: 'Rutas en Áncash',
    links: [
      ['Laguna 69', '#rutas'],
      ['Santa Cruz', '#rutas'],
      ['Circuito Huayhuash', '#rutas'],
    ],
  },
  {
    title: 'Rutas en Cusco',
    links: [
      ['Salkantay', '#rutas'],
      ['Ausangate', '#rutas'],
      ['Choquequirao', '#rutas'],
    ],
  },
  {
    title: 'Antes de viajar',
    links: [
      ['Cómo funciona', '#como-funciona'],
      ['Preparación y FAQ', '#preparacion'],
      ['Cotizar', '#cotizar'],
    ],
  },
]

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-granite text-white/75">
      <div className="container-page grid gap-10 py-14 md:grid-cols-12">
        <div className="md:col-span-4" style={{ '--logo-snow': 'var(--color-granite)' }}>
          <span className="text-white">
            <Logo />
          </span>
          <p className="mt-4 max-w-xs text-[0.95rem]">
            Expediciones de trekking en grupos pequeños desde Huaraz y Cusco.
          </p>
        </div>
        <nav aria-label="Pie de página" className="grid gap-8 sm:grid-cols-3 md:col-span-8">
          {COLUMNS.map((column) => (
            <div key={column.title}>
              <h2 className="font-sans text-sm font-semibold text-white">{column.title}</h2>
              <ul className="mt-3 space-y-1">
                {column.links.map(([label, href]) => (
                  <li key={label}>
                    <a href={href} className="inline-flex min-h-9 items-center text-[0.95rem] hover:text-white">
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>
      <div className="container-page flex flex-col gap-2 border-t border-white/10 py-6 text-sm text-white/60 sm:flex-row sm:justify-between">
        <p>Nevado es un negocio ficticio, creado como proyecto de portafolio por Favio (@Itsfavi0).</p>
        <p>Fotos de Unsplash, créditos en el README.</p>
      </div>
    </footer>
  )
}

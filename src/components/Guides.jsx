import Reveal from './Reveal'

// Personas ficticias. Sin fotos de personas reales: cada guía se presenta
// con sus iniciales sobre la curva de nivel de "su" montaña.
const GUIDES = [
  {
    name: 'Rosa Cacha Villanueva',
    initials: 'RC',
    role: 'Guía principal, Cordillera Blanca',
    origin: 'Vicos, Áncash',
    years: 14,
    languages: 'Quechua, castellano, inglés',
    note: 'Ha cruzado Punta Unión más de doscientas veces y todavía se detiene en el mismo mirador.',
    hue: 'bg-lagoon',
  },
  {
    name: 'Elmer Quispe Tarazona',
    initials: 'EQ',
    role: 'Guía de Huayhuash',
    origin: 'Llamac, Áncash',
    years: 11,
    languages: 'Castellano, inglés',
    note: 'Formado en rescate en altura. Es quien decide, sin discusión, cuándo un paso no se cruza.',
    hue: 'bg-granite-soft',
  },
  {
    name: 'Nilda Huillca Mamani',
    initials: 'NH',
    role: 'Guía de Cusco',
    origin: 'Pacchanta, Cusco',
    years: 9,
    languages: 'Quechua, castellano, inglés, francés',
    note: 'Creció pastoreando alpacas al pie del Ausangate. Sus explicaciones sobre los apus no vienen en ninguna guía.',
    hue: 'bg-flare-deep',
  },
  {
    name: 'Julián Pariona Ramírez',
    initials: 'JP',
    role: 'Arriero mayor',
    origin: 'Colcabamba, Áncash',
    years: 22,
    languages: 'Quechua, castellano',
    note: 'Arma el campamento antes de que llegue el grupo y conoce a cada mula por su nombre.',
    hue: 'bg-lagoon-deep',
  },
]

export default function Guides() {
  return (
    <section id="guias" aria-labelledby="guides-title" className="border-t border-line py-20 md:py-28">
      <div className="container-page">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <h2 id="guides-title" className="section-title text-granite lg:col-span-7">
            Guías que nacieron bajo estos nevados.
          </h2>
          <p className="max-w-md text-lg text-rock lg:col-span-5">
            Todo el equipo es de las comunidades donde caminamos. Cada guía tiene formación en primeros
            auxilios en zonas remotas y renueva su certificación cada dos años.
          </p>
        </div>

        <ul className="mt-14 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {GUIDES.map((guide, index) => (
            <Reveal as="li" key={guide.name} style={{ transitionDelay: `${index * 70}ms` }}>
              <div className={`relative aspect-[4/5] overflow-hidden rounded-[var(--radius-card)] ${guide.hue}`}>
                <div
                  aria-hidden="true"
                  className="topo absolute inset-0 bg-white/25"
                  style={{ maskPosition: `${index * 37}% ${index * 23}%`, WebkitMaskPosition: `${index * 37}% ${index * 23}%` }}
                />
                <span aria-hidden="true" className="absolute bottom-4 left-5 font-display text-[5.5rem] font-extrabold leading-none text-white font-condensed">
                  {guide.initials}
                </span>
                <span className="absolute right-4 top-4 rounded-full bg-white/90 px-3 py-1 font-mono text-[0.75rem] text-granite">
                  {guide.years} años en ruta
                </span>
              </div>
              <h3 className="mt-5 font-display text-[1.65rem] font-extrabold font-narrow leading-none text-granite">
                {guide.name}
              </h3>
              <p className="mt-1.5 text-[0.95rem] font-medium text-lagoon">{guide.role}</p>
              <p className="mt-3 text-[0.95rem] text-rock">{guide.note}</p>
              <dl className="mt-4 space-y-1 text-sm">
                <div className="flex gap-2">
                  <dt className="text-rock">De</dt>
                  <dd>{guide.origin}</dd>
                </div>
                <div className="flex gap-2">
                  <dt className="text-rock">Habla</dt>
                  <dd>{guide.languages}</dd>
                </div>
              </dl>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}

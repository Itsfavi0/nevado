import ElevationProfile from './ElevationProfile'
import Photo from './Photo'
import { getRoute } from '../data/routes'

const featured = getRoute('santa-cruz')

export default function Hero() {
  return (
    <section id="inicio" aria-labelledby="hero-title" className="relative overflow-hidden">
      <div aria-hidden="true" className="topo absolute inset-x-0 top-0 h-[34rem] bg-lagoon/10" />

      <div className="container-page relative grid gap-8 pb-10 pt-12 md:pt-20 lg:grid-cols-12 lg:items-end lg:pb-14">
        <h1
          id="hero-title"
          className="font-display text-[clamp(3.6rem,13vw,9.5rem)] font-extrabold leading-[0.86] tracking-[-0.02em] text-granite lg:col-span-7"
          style={{ fontStretch: '64%' }}
        >
          La montaña marca el ritmo.
        </h1>
        <div className="max-w-md lg:col-span-5 lg:pb-3">
          <p className="text-lg leading-relaxed text-granite/85">
            Expediciones de trekking en la Cordillera Blanca, Huayhuash y Cusco. Grupos de ocho
            personas como máximo, guías nacidos bajo estos nevados y días de aclimatación que no se
            recortan.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <a href="#rutas" className="btn btn-primary">
              Explorar rutas
            </a>
            <a href="#cotizar" className="btn btn-ghost text-granite">
              Cotizar mi grupo
            </a>
          </div>
        </div>
      </div>

      <div className="relative mx-auto max-w-[96rem] md:px-4">
        <div className="relative isolate overflow-hidden bg-granite md:rounded-[var(--radius-card)]">
          <Photo
            srcSet="/images/hero-900.webp 900w, /images/hero-1600.webp 1600w"
            sizes="(min-width: 1536px) 1536px, 100vw"
            src="/images/hero-1600.webp"
            alt="Dos caminantes avanzan por un sendero de piedra hacia picos nevados de los Andes"
            width={1600}
            height={1067}
            fetchPriority="high"
            className="aspect-[4/5] w-full object-cover sm:aspect-[16/10] lg:aspect-[21/9]"
          />
          <div
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-granite/85 via-granite/35 to-transparent"
          />

          <div className="absolute inset-x-0 bottom-0 px-5 pb-5 md:px-10 md:pb-8">
            <ElevationProfile route={featured} height={110} variant="hero" tone="dark" scale="route" />
            <p className="mt-3 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 text-sm text-white/85">
              <span>
                <a href="#rutas" className="font-semibold text-white underline decoration-white/40 underline-offset-4 hover:decoration-white">
                  Santa Cruz
                </a>
                , de Cashapampa a Vaquería en cuatro días
              </span>
              <span className="font-mono text-[0.8125rem] tabular">50 km · +2400 m · máx. 4750 m</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

import Reveal from './Reveal'
import { AltitudeIcon, GroupIcon, HandsIcon, PulseIcon } from './Icons'

const REASONS = [
  {
    icon: GroupIcon,
    title: 'Ocho personas como máximo',
    text: 'Un guía por cada cuatro caminantes y un asistente desde los seis inscritos. Nadie camina solo al final de la fila.',
    fact: '1 guía : 4 caminantes',
  },
  {
    icon: AltitudeIcon,
    title: 'Aclimatación que no se negocia',
    text: 'Antes de cualquier ruta sobre 4500 m pasas dos noches en Huaraz o Cusco y haces una caminata de prueba con nosotros.',
    fact: '2 noches previas',
  },
  {
    icon: PulseIcon,
    title: 'Seguridad que se mide',
    text: 'Oxímetro mañana y noche, botiquín de altura, oxígeno y teléfono satelital en cada salida. Si tu saturación no acompaña, el guía decide bajar.',
    fact: 'SpO₂ 2 veces al día',
  },
  {
    icon: HandsIcon,
    title: 'Turismo que se queda en la zona',
    text: 'Arrieros y cocineros de Vicos, Colcabamba y Pacchanta con tarifa justa, campamentos sin rastro y un fondo para las comunidades por donde pasamos.',
    fact: '8 % de cada reserva',
  },
]

export default function WhyNevado() {
  return (
    <section aria-labelledby="why-title" className="py-20 md:py-28">
      <div className="container-page grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-28">
            <h2 id="why-title" className="section-title text-granite">
              Volver también es parte de la cumbre.
            </h2>
            <p className="mt-6 max-w-md text-lg text-rock">
              Llevamos grupos a la montaña desde Huaraz con una regla simple: la ruta se adapta a las
              personas, nunca al revés.
            </p>
          </div>
        </div>

        <ul className="lg:col-span-7 lg:col-start-6">
          {REASONS.map(({ icon: Icon, title, text, fact }) => (
            <Reveal
              as="li"
              key={title}
              className="grid gap-x-6 gap-y-3 border-t border-line py-8 first:border-t-0 first:pt-0 sm:grid-cols-[3rem_1fr_auto] lg:first:pt-2"
            >
              <span className="flex size-12 items-center justify-center rounded-full bg-ice text-lagoon">
                <Icon />
              </span>
              <div>
                <h3 className="font-display text-[1.75rem] font-extrabold font-narrow text-granite">{title}</h3>
                <p className="mt-2 max-w-prose text-rock">{text}</p>
              </div>
              <p className="data-value whitespace-nowrap text-sm text-lagoon sm:pt-2 sm:text-right">{fact}</p>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}

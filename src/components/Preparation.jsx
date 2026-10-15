import { formatNumber } from '../lib/quote'
import { PlusIcon } from './Icons'
import Reveal from './Reveal'

// Oxígeno disponible respecto al nivel del mar (aproximado).
const ALTITUDES = [
  { altitude: 5150, place: 'Abra Palomani, Ausangate', oxygen: 53 },
  { altitude: 4750, place: 'Punta Unión, Santa Cruz', oxygen: 56 },
  { altitude: 4200, place: 'Campamentos de altura', oxygen: 61 },
  { altitude: 3400, place: 'Cusco', oxygen: 67 },
  { altitude: 3052, place: 'Huaraz', oxygen: 70 },
  { altitude: 0, place: 'Lima, nivel del mar', oxygen: 100 },
]

const FAQ = [
  {
    question: '¿Qué es el mal de altura y cómo lo evitan?',
    answer:
      'Es la reacción del cuerpo al aire con menos oxígeno: dolor de cabeza, náuseas, cansancio y mal sueño. Se previene subiendo despacio, durmiendo más bajo de lo que se camina, tomando tres litros de agua al día y respetando los días de aclimatación. Medimos tu saturación dos veces al día y, si los síntomas avanzan, la única solución real es bajar, y bajamos.',
  },
  {
    question: '¿Qué nivel físico necesito?',
    answer:
      'Para Laguna 69 o Churup basta con caminar seis horas con pausas. Para Santa Cruz o Salkantay, entrena unas ocho semanas con caminatas largas y escaleras. Huayhuash y Ausangate piden experiencia previa en rutas de varios días sobre 4000 m; te preguntamos por ella antes de confirmar.',
  },
  {
    question: '¿Cuál es la mejor época para ir?',
    answer:
      'La temporada seca va de mayo a septiembre: cielos despejados, días templados y noches bajo cero. Abril, octubre y noviembre son meses de transición con algo de lluvia y menos gente. De diciembre a marzo llueve casi a diario y no operamos las rutas con pasos sobre 4700 m.',
  },
  {
    question: '¿Necesito un seguro?',
    answer:
      'Sí. Pedimos un seguro de viaje que cubra trekking hasta 5500 m y evacuación. Si no tienes uno, te recomendamos opciones al reservar.',
  },
  {
    question: '¿Qué pasa si cancelo o si cancelan ustedes?',
    answer:
      'Hasta 45 días antes puedes cambiar la fecha sin costo o recuperar el adelanto completo. Entre 45 y 15 días se devuelve la mitad. Si cancelamos por clima o seguridad, eliges entre otra fecha, otra ruta o el reembolso total.',
  },
]

const PACKING = [
  {
    title: 'Ropa',
    items: ['Chaqueta impermeable y respirable', 'Casaca de pluma o sintética', 'Dos capas térmicas', 'Gorro, guantes y buff', 'Botas de trekking ya usadas'],
  },
  {
    title: 'Equipo',
    items: ['Mochila de 30 a 40 litros', 'Bolsa de dormir de −10 °C (o alquílala)', 'Linterna frontal con pilas extra', 'Bastones', 'Dos botellas de un litro'],
  },
  {
    title: 'Salud',
    items: ['Bloqueador FPS 50 y lentes de sol', 'Tus medicinas personales', 'Protector labial', 'Pastillas potabilizadoras', 'Seguro de viaje impreso'],
  },
]

export default function Preparation() {
  return (
    <section id="preparacion" aria-labelledby="prep-title" className="py-20 md:py-28">
      <div className="container-page">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <h2 id="prep-title" className="section-title text-granite lg:col-span-7">
            Prepárate para la altura.
          </h2>
          <p className="max-w-md text-lg text-rock lg:col-span-5">
            La parte difícil del trekking andino no son los kilómetros, es el aire. Esto es lo que
            conviene saber antes de reservar.
          </p>
        </div>

        <div className="mt-14 grid gap-14 lg:grid-cols-12 lg:gap-12">
          <AltitudeLadder />

          <div className="lg:col-span-7">
            <h3 className="font-display text-3xl font-extrabold font-narrow text-granite">Preguntas frecuentes</h3>
            <div className="mt-4 border-t border-line">
              {FAQ.map((item) => (
                <details key={item.question} className="group border-b border-line">
                  <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-4 text-lg font-semibold text-granite [&::-webkit-details-marker]:hidden">
                    {item.question}
                    <PlusIcon className="size-5 shrink-0 text-lagoon transition-transform duration-200 ease-[var(--ease-out)] group-open:rotate-45" />
                  </summary>
                  <p className="max-w-prose pb-6 text-rock">{item.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-20">
          <h3 className="font-display text-3xl font-extrabold font-narrow text-granite">Qué llevar</h3>
          <p className="mt-2 max-w-prose text-rock">
            Nosotros ponemos carpas, cocina, comida y equipo de seguridad. Tú solo cargas una mochila de
            día; las mulas llevan el resto (hasta 7 kg por persona).
          </p>
          <div className="mt-8 grid gap-8 sm:grid-cols-3">
            {PACKING.map((group) => (
              <div key={group.title} className="border-t-2 border-granite pt-4">
                <h4 className="font-semibold text-granite">{group.title}</h4>
                <ul className="mt-3 space-y-2 text-[0.95rem] text-rock">
                  {group.items.map((item) => (
                    <li key={item} className="flex gap-2.5">
                      <span aria-hidden="true" className="mt-[0.6em] size-1.5 shrink-0 rounded-full bg-lagoon" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function AltitudeLadder() {
  return (
    <Reveal className="lg:col-span-5">
      <h3 className="font-display text-3xl font-extrabold font-narrow text-granite">Cuánto oxígeno hay allá arriba</h3>
      <p className="mt-2 text-rock">Porcentaje de oxígeno disponible frente al nivel del mar, aproximado.</p>
      <table className="mt-6 w-full border-collapse text-left">
        <caption className="sr-only">Oxígeno disponible según la altitud</caption>
        <thead className="sr-only">
          <tr>
            <th scope="col">Lugar y altitud</th>
            <th scope="col">Oxígeno disponible</th>
          </tr>
        </thead>
        <tbody>
          {ALTITUDES.map((row) => (
            <tr key={row.place} className="border-b border-line last:border-0">
              <th scope="row" className="py-3 pr-3 align-top font-normal">
                <span className="block font-medium text-granite">{row.place}</span>
                <span className="data-value text-sm text-rock">{formatNumber(row.altitude)} m</span>
              </th>
              {/* oxlint-disable-next-line jsx-a11y/control-has-associated-label -- celda de datos, no un control */}
              <td className="w-1/2 py-3 align-middle">
                <span className="flex items-center gap-3">
                  <span aria-hidden="true" className="relative h-2 flex-1 overflow-hidden rounded-full bg-ice">
                    <span
                      className={`absolute inset-y-0 left-0 rounded-full ${row.oxygen < 60 ? 'bg-flare' : 'bg-lagoon'}`}
                      style={{ width: `${row.oxygen}%` }}
                    />
                  </span>
                  <span className="data-value w-14 whitespace-nowrap text-right text-granite">{row.oxygen} %</span>
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Reveal>
  )
}

import Reveal from './Reveal'

const FEATURED = {
  quote:
    'En el tercer día de Huayhuash me bajó la saturación. Elmer me hizo descansar un día entero en Huanacpatay en vez de seguir con el grupo, y gracias a eso crucé Punta Cuyoc entera. Esa decisión vale más que cualquier foto.',
  name: 'Camila Ortega',
  from: 'Santiago de Chile',
  route: 'Circuito Huayhuash',
  date: 'julio 2025',
}

const OTHERS = [
  {
    quote:
      'Era mi primer trekking de varios días. La caminata de prueba a Churup me quitó el miedo y el plan de entrenamiento llegó con ocho semanas de margen.',
    name: 'Diego Salazar',
    from: 'Lima',
    route: 'Santa Cruz',
    date: 'junio 2025',
  },
  {
    quote:
      'Nilda nos explicó el Ausangate desde adentro: los nombres de cada laguna, las ofrendas, las familias que viven ahí. Volvimos sabiendo dónde estuvimos.',
    name: 'Hannah y Jonas Weber',
    from: 'Múnich',
    route: 'Circuito Ausangate',
    date: 'agosto 2025',
  },
]

export default function Testimonials() {
  return (
    <section aria-labelledby="testimonials-title" className="bg-ice/60 py-20 md:py-28">
      <div className="container-page">
        <h2 id="testimonials-title" className="section-title max-w-3xl text-granite">
          Lo que cuentan al volver.
        </h2>

        <div className="mt-12 grid gap-10 lg:grid-cols-12 lg:gap-12">
          <Reveal as="figure" className="lg:col-span-7">
            <blockquote className="font-display text-[clamp(1.75rem,3.4vw,2.6rem)] font-bold leading-[1.12] text-granite font-narrow">
              <p>“{FEATURED.quote}”</p>
            </blockquote>
            <Attribution {...FEATURED} />
          </Reveal>

          <div className="space-y-10 lg:col-span-5 lg:border-l lg:border-line lg:pl-12">
            {OTHERS.map((item) => (
              <Reveal as="figure" key={item.name}>
                <blockquote className="text-lg text-granite/90">
                  <p>“{item.quote}”</p>
                </blockquote>
                <Attribution {...item} />
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function Attribution({ name, from, route, date }) {
  return (
    <figcaption className="mt-5 flex flex-wrap items-baseline gap-x-3 gap-y-1">
      <span className="font-semibold text-granite">{name}</span>
      <span className="text-rock">{from}</span>
      <span className="font-mono text-[0.8125rem] text-lagoon">
        {route}, {date}
      </span>
    </figcaption>
  )
}

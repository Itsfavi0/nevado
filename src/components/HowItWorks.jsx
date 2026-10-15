import Reveal from './Reveal'

const STEPS = [
  {
    when: 'Hoy',
    title: 'Reservas tu cupo',
    text: 'Cotizas, eliges fecha y aseguras el cupo con el 30 % de adelanto. Hasta 45 días antes puedes cambiar de fecha sin costo.',
  },
  {
    when: '8 semanas antes',
    title: 'Te preparas con nosotros',
    text: 'Recibes un plan de entrenamiento según la ruta, la lista de equipo y una llamada con tu guía para revisar salud y experiencia previa.',
  },
  {
    when: '2 días antes',
    title: 'Te aclimatas en Huaraz o Cusco',
    text: 'Llegas con tiempo, duermes a 3000 m y haces una caminata de prueba. El guía mide tu saturación y ajusta el ritmo del grupo.',
  },
  {
    when: 'Día 1',
    title: 'Sales a la montaña',
    text: 'Transporte privado al inicio de la ruta, arrieros y mulas listos, y un parte diario a tu contacto de emergencia.',
  },
]

export default function HowItWorks() {
  return (
    <section id="como-funciona" aria-labelledby="how-title" className="relative overflow-hidden bg-granite py-20 text-white md:py-28">
      <div aria-hidden="true" className="topo absolute inset-0 bg-white/[0.06]" />
      <div className="container-page relative">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <h2 id="how-title" className="section-title lg:col-span-7">
            De la reserva al primer campamento.
          </h2>
          <p className="max-w-md text-lg text-white/75 lg:col-span-5">
            Cuatro etapas, y en todas sabes quién es tu guía. La expedición empieza mucho antes de
            ponerte las botas.
          </p>
        </div>

        <div className="relative mt-14">
          <span aria-hidden="true" className="absolute bottom-2 left-[7px] top-2 w-px bg-white/25 md:hidden lg:bottom-auto lg:left-0 lg:right-0 lg:top-[7px] lg:block lg:h-px lg:w-auto" />
          <ol className="grid gap-10 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
            {STEPS.map((step, index) => (
              <Reveal as="li" key={step.title} className="relative pl-9 lg:pl-0 lg:pt-10" style={{ transitionDelay: `${index * 80}ms` }}>
                <span
                  aria-hidden="true"
                  className={`absolute left-0 top-0 size-[15px] rounded-full border-2 ${
                    index === STEPS.length - 1 ? 'border-flare bg-flare' : 'border-lagoon-bright bg-granite'
                  }`}
                />
                <p className="font-mono text-[0.8125rem] text-lagoon-bright">
                  <span className="sr-only">Paso {index + 1}, </span>
                  {step.when}
                </p>
                <h3 className="mt-2 font-display text-[1.9rem] font-extrabold font-narrow">{step.title}</h3>
                <p className="mt-3 text-white/75">{step.text}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}

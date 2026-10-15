import { useState } from 'react'
import Contact from './components/Contact'
import Footer from './components/Footer'
import Guides from './components/Guides'
import Header from './components/Header'
import Hero from './components/Hero'
import HowItWorks from './components/HowItWorks'
import Preparation from './components/Preparation'
import QuoteCalculator from './components/QuoteCalculator'
import RouteExplorer from './components/routes/RouteExplorer'
import Testimonials from './components/Testimonials'
import WhyNevado from './components/WhyNevado'

function scrollToSection(id, focusId) {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  document.getElementById(id)?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' })
  document.getElementById(focusId)?.focus({ preventScroll: true })
}

export default function App() {
  const [quoteRouteId, setQuoteRouteId] = useState('santa-cruz')
  const [contactPrefill, setContactPrefill] = useState(null)

  // Desde una ruta: la elige en el cotizador y lleva ahí.
  const quoteRoute = (routeId) => {
    setQuoteRouteId(routeId)
    requestAnimationFrame(() => scrollToSection('cotizar', 'quote-route'))
  }

  // Desde el cotizador: rellena el formulario de contacto.
  const requestQuote = (data) => {
    setContactPrefill({ ...data, nonce: Date.now() })
    requestAnimationFrame(() => scrollToSection('contacto', 'contact-name'))
  }

  return (
    <>
      <a
        href="#contenido"
        className="sr-only z-50 rounded-full bg-granite px-5 py-3 font-semibold text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Saltar al contenido
      </a>
      <Header />
      <main id="contenido" tabIndex={-1} className="outline-none">
        <Hero />
        <WhyNevado />
        <RouteExplorer onQuote={quoteRoute} />
        <HowItWorks />
        <QuoteCalculator routeId={quoteRouteId} onRouteChange={setQuoteRouteId} onRequest={requestQuote} />
        <Guides />
        <Testimonials />
        <Preparation />
        <Contact prefill={contactPrefill} />
      </main>
      <Footer />
    </>
  )
}

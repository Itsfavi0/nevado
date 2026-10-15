import { useEffect, useRef, useState } from 'react'
import Logo from './Logo'
import { CloseIcon, MenuIcon } from './Icons'

const LINKS = [
  { href: '#rutas', label: 'Rutas' },
  { href: '#como-funciona', label: 'Cómo funciona' },
  { href: '#guias', label: 'Guías' },
  { href: '#preparacion', label: 'Preparación' },
  { href: '#contacto', label: 'Contacto' },
]

export default function Header() {
  const [open, setOpen] = useState(false)
  const buttonRef = useRef(null)

  useEffect(() => {
    if (!open) return
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        setOpen(false)
        buttonRef.current?.focus()
      }
    }
    const onResize = () => window.innerWidth >= 1024 && setOpen(false)
    document.addEventListener('keydown', onKeyDown)
    window.addEventListener('resize', onResize)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('resize', onResize)
    }
  }, [open])

  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-snow/90 backdrop-blur-md">
      <div className="container-page flex h-16 items-center justify-between gap-6">
        <a href="#inicio" className="-ml-1 rounded p-1 text-granite" aria-label="Nevado, ir al inicio">
          <Logo />
        </a>

        <nav aria-label="Principal" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="rounded-full px-3.5 py-2 text-[0.95rem] font-medium text-granite/80 transition-colors duration-150 hover:text-lagoon"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <a href="#cotizar" className="btn btn-primary hidden sm:inline-flex">
            Cotizar expedición
          </a>
          <button
            ref={buttonRef}
            type="button"
            className="inline-flex size-11 items-center justify-center rounded-full text-granite lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      <nav
        id="mobile-menu"
        aria-label="Principal (móvil)"
        hidden={!open}
        className="border-t border-line/70 bg-snow lg:hidden"
      >
        <ul className="container-page flex flex-col py-3">
          {[...LINKS, { href: '#cotizar', label: 'Cotizar expedición' }].map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                onClick={() => setOpen(false)}
                className="flex min-h-12 items-center border-b border-line/50 font-display text-2xl font-extrabold font-narrow text-granite last:border-0"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}

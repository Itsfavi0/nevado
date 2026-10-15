import { useEffect, useRef, useState } from 'react'

/** Devuelve [ref, inView]. Se queda en `true` después de la primera vez. */
export function useInView({ threshold = 0.25, rootMargin = '0px' } = {}) {
  const ref = useRef(null)
  // Sin IntersectionObserver (navegadores muy viejos) se muestra todo.
  const [inView, setInView] = useState(() => !('IntersectionObserver' in window))

  useEffect(() => {
    const node = ref.current
    if (!node || inView) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.disconnect()
        }
      },
      { threshold, rootMargin },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [inView, threshold, rootMargin])

  return [ref, inView]
}

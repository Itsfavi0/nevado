import { useEffect, useState } from 'react'

/** Ancho en px de un elemento, actualizado al redimensionar. */
export function useElementWidth(ref, fallback = 600) {
  const [width, setWidth] = useState(fallback)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    const observer = new ResizeObserver(([entry]) => {
      setWidth(Math.max(1, Math.round(entry.contentRect.width)))
    })
    observer.observe(node)
    return () => observer.disconnect()
  }, [ref])

  return width
}

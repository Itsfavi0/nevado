import { useInView } from '../hooks/useInView'

/** Envoltorio que aparece suavemente la primera vez que entra en pantalla. */
export default function Reveal({ as: Tag = 'div', className = '', children, ...props }) {
  const [ref, inView] = useInView({ threshold: 0.15 })
  return (
    <Tag ref={ref} className={`reveal ${inView ? 'is-visible' : ''} ${className}`} {...props}>
      {children}
    </Tag>
  )
}

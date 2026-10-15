export function LogoMark({ className = 'size-8' }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true" focusable="false">
      <path d="M2 27 13 8l6 10 3-4 8 13Z" fill="currentColor" />
      <path d="m10.1 13 2.9-5 2.9 5-1.6-1-1.3 1.6-1.3-1.6Z" fill="var(--logo-snow, #fff)" />
      <path d="M4 30h24" stroke="var(--color-flare)" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

export default function Logo({ className = '' }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <LogoMark />
      <span className="font-display text-[1.6rem] font-extrabold leading-none tracking-tight font-condensed">
        Nevado
      </span>
    </span>
  )
}

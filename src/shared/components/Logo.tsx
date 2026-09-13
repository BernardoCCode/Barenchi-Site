import { Link } from 'react-router-dom'

type LogoProps = {
  to?: string
}

export function Logo({ to = '/' }: LogoProps) {
  return (
    <Link to={to} className="logo" aria-label="Barenchi home">
      <picture>
        <source srcSet="/barenchi-logo-lockup.webp" type="image/webp" />
        <img
          className="logo-lockup"
          src="/barenchi-logo-lockup.png"
          alt="Barenchi"
          width={354}
          height={84}
          decoding="async"
          fetchPriority="high"
        />
      </picture>
    </Link>
  )
}

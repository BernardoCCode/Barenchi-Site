import type { FocusEvent, PointerEvent, ReactNode } from 'react'
import { Link } from 'react-router-dom'

type AppLinkProps = {
  href: string
  className?: string
  children: ReactNode
  'aria-current'?: 'page'
  'aria-label'?: string
  'data-nav'?: string
  onClick?: () => void
  onPointerEnter?: (event: PointerEvent<HTMLAnchorElement>) => void
  onFocus?: () => void
  onBlur?: (event: FocusEvent<HTMLAnchorElement>) => void
}

function isRoutedPath(href: string) {
  return href.startsWith('/') && !href.startsWith('//') && !href.includes('#')
}

export function AppLink({ href, className, children, ...rest }: AppLinkProps) {
  if (isRoutedPath(href)) {
    return (
      <Link to={href} className={className} {...rest}>
        {children}
      </Link>
    )
  }

  return (
    <a href={href} className={className} {...rest}>
      {children}
    </a>
  )
}

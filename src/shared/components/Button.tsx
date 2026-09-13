import { ArrowRight } from 'lucide-react'
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

type ButtonProps = {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'ghost'
  showArrow?: boolean
  className?: string
  href?: string
  type?: 'button' | 'submit'
}

export function Button({
  children,
  variant = 'primary',
  showArrow = false,
  className,
  href,
  type = 'button',
}: ButtonProps) {
  const cls = `btn btn-${variant}${className ? ` ${className}` : ''}`
  const content = (
    <>
      {children}
      {showArrow ? <ArrowRight strokeWidth={1.4} /> : null}
    </>
  )

  if (href) {
    const internal = href.startsWith('/') && !href.includes('#')
    if (internal) {
      return (
        <Link to={href} className={cls}>
          {content}
        </Link>
      )
    }
    return (
      <a href={href} className={cls}>
        {content}
      </a>
    )
  }

  return (
    <button type={type} className={cls}>
      {content}
    </button>
  )
}

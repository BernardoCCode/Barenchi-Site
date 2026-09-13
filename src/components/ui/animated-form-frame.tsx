import { motion, useReducedMotion } from 'motion/react'
import { type ReactNode } from 'react'

type AnimatedFormFrameProps = {
  children: ReactNode
  className?: string
}

function Beam({
  className,
  animate,
  transition,
}: {
  className: string
  animate: Record<string, string | string[]>
  transition: Record<string, unknown>
}) {
  const reduce = useReducedMotion()
  if (reduce) return null
  return <motion.span className={className} animate={animate} transition={transition} aria-hidden />
}

export function AnimatedFormFrame({ children, className = '' }: AnimatedFormFrameProps) {
  const reduce = useReducedMotion()

  return (
    <div className={`animated-form-frame group ${className}`.trim()}>
      {!reduce ? (
        <div className="animated-form-frame__beams" aria-hidden>
          <Beam
            className="animated-form-frame__beam animated-form-frame__beam--top"
            animate={{ left: ['-50%', '100%'], opacity: ['0.2', '0.85', '0.2'] }}
            transition={{
              left: { duration: 2.8, ease: 'easeInOut', repeat: Infinity, repeatDelay: 1.2 },
              opacity: { duration: 1.4, repeat: Infinity, repeatType: 'mirror' },
            }}
          />
          <Beam
            className="animated-form-frame__beam animated-form-frame__beam--right"
            animate={{ top: ['-50%', '100%'], opacity: ['0.2', '0.85', '0.2'] }}
            transition={{
              top: { duration: 2.8, ease: 'easeInOut', repeat: Infinity, repeatDelay: 1.2, delay: 0.7 },
              opacity: { duration: 1.4, repeat: Infinity, repeatType: 'mirror', delay: 0.7 },
            }}
          />
          <Beam
            className="animated-form-frame__beam animated-form-frame__beam--bottom"
            animate={{ right: ['-50%', '100%'], opacity: ['0.2', '0.85', '0.2'] }}
            transition={{
              right: { duration: 2.8, ease: 'easeInOut', repeat: Infinity, repeatDelay: 1.2, delay: 1.4 },
              opacity: { duration: 1.4, repeat: Infinity, repeatType: 'mirror', delay: 1.4 },
            }}
          />
          <Beam
            className="animated-form-frame__beam animated-form-frame__beam--left"
            animate={{ bottom: ['-50%', '100%'], opacity: ['0.2', '0.85', '0.2'] }}
            transition={{
              bottom: { duration: 2.8, ease: 'easeInOut', repeat: Infinity, repeatDelay: 1.2, delay: 2.1 },
              opacity: { duration: 1.4, repeat: Infinity, repeatType: 'mirror', delay: 2.1 },
            }}
          />
        </div>
      ) : null}
      <div className="animated-form-frame__panel">{children}</div>
    </div>
  )
}

import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { useRef, type ReactNode } from 'react'

type ClipReadProps = {
  children: ReactNode
  className?: string
}

export function ClipRead({ children, className }: ClipReadProps) {
  const ref = useRef<HTMLParagraphElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.88', 'end 0.38'],
  })
  const backgroundPositionX = useTransform(scrollYProgress, [0, 1], ['100%', '0%'])

  if (reduce) {
    return <p className={className}>{children}</p>
  }

  return (
    <motion.p
      ref={ref}
      className={className ? `clip-read ${className}` : 'clip-read'}
      style={{ backgroundPositionX }}
    >
      {children}
    </motion.p>
  )
}

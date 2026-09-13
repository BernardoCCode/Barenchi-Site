import { motion, useReducedMotion } from 'motion/react'
import { useEffect, useId, useState, type RefObject } from 'react'

type BeamProps = {
  containerRef: RefObject<HTMLElement | null>
  fromRef: RefObject<HTMLElement | null>
  toRef: RefObject<HTMLElement | null>
  curvature?: number
  reverse?: boolean
  delay?: number
  duration?: number
}

export function AnimatedBeam({
  containerRef,
  fromRef,
  toRef,
  curvature = 0,
  reverse = false,
  delay = 0,
  duration = 5.2,
}: BeamProps) {
  const id = useId()
  const reduce = useReducedMotion()
  const [pathD, setPathD] = useState('')
  const [size, setSize] = useState({ width: 0, height: 0 })

  useEffect(() => {
    const updatePath = () => {
      const container = containerRef.current
      const from = fromRef.current
      const to = toRef.current
      if (!container || !from || !to) return

      const box = container.getBoundingClientRect()
      const a = from.getBoundingClientRect()
      const b = to.getBoundingClientRect()
      setSize({ width: box.width, height: box.height })

      const startX = a.left - box.left + a.width / 2
      const startY = a.top - box.top + a.height / 2
      const endX = b.left - box.left + b.width / 2
      const endY = b.top - box.top + b.height / 2
      const controlY = startY - curvature
      setPathD(`M ${startX},${startY} Q ${(startX + endX) / 2},${controlY} ${endX},${endY}`)
    }

    const observer = new ResizeObserver(updatePath)
    if (containerRef.current) observer.observe(containerRef.current)
    updatePath()
    return () => observer.disconnect()
  }, [containerRef, fromRef, toRef, curvature])

  if (!pathD || size.width === 0) return null

  const gradient = reverse
    ? { x1: ['90%', '-10%'], x2: ['100%', '0%'] }
    : { x1: ['10%', '110%'], x2: ['0%', '100%'] }

  return (
    <svg className="beam-svg" width={size.width} height={size.height} viewBox={`0 0 ${size.width} ${size.height}`} fill="none" aria-hidden>
      <path d={pathD} stroke="var(--line)" strokeWidth="1" strokeLinecap="round" />
      {reduce !== true ? (
        <path d={pathD} stroke={`url(#${id})`} strokeWidth="1.5" strokeLinecap="round" />
      ) : null}
      <defs>
        <motion.linearGradient
          id={id}
          gradientUnits="userSpaceOnUse"
          initial={{ x1: '0%', x2: '0%', y1: '0%', y2: '0%' }}
          animate={{ x1: gradient.x1, x2: gradient.x2, y1: ['0%', '0%'], y2: ['0%', '0%'] }}
          transition={{
            delay,
            duration,
            ease: [0.16, 1, 0.3, 1],
            repeat: Infinity,
            repeatDelay: 0.4,
          }}
        >
          <stop stopColor="#6B4A35" stopOpacity="0" />
          <stop offset="0.32" stopColor="#6B4A35" />
          <stop offset="1" stopColor="#6B4A35" stopOpacity="0" />
        </motion.linearGradient>
      </defs>
    </svg>
  )
}

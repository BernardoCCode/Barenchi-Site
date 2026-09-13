'use client'

import { cn } from '@/lib/utils'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useCallback, useEffect, useRef, useState } from 'react'

export type CardStackItem = {
  id: string | number
  title: string
  description?: string
  tag?: string
  number?: string
}

export type CardStackProps<T extends CardStackItem> = {
  items: T[]
  initialIndex?: number
  cardWidth?: number
  cardHeight?: number
  autoAdvance?: boolean
  intervalMs?: number
  pauseOnHover?: boolean
  showDots?: boolean
  compact?: boolean
  className?: string
  renderCard?: (item: T, state: { active: boolean }) => React.ReactNode
}

function wrapIndex(n: number, len: number) {
  if (len <= 0) return 0
  return ((n % len) + len) % len
}

function signedOffset(i: number, active: number, len: number) {
  const raw = i - active
  const alt = raw > 0 ? raw - len : raw + len
  return Math.abs(alt) < Math.abs(raw) ? alt : raw
}

export function CardStack<T extends CardStackItem>({
  items,
  initialIndex = 0,
  cardWidth = 380,
  cardHeight = 300,
  autoAdvance = true,
  intervalMs = 4500,
  pauseOnHover = true,
  showDots = true,
  compact = false,
  className,
  renderCard,
}: CardStackProps<T>) {
  const reduce = useReducedMotion()
  const len = items.length
  const [active, setActive] = useState(() => wrapIndex(initialIndex, len))
  const [hovering, setHovering] = useState(false)
  const [dragEnabled, setDragEnabled] = useState(true)
  const selectionLockedUntil = useRef(0)
  const unlockTimer = useRef<number | null>(null)

  useEffect(() => {
    setActive((current) => wrapIndex(current, len))
  }, [len])

  useEffect(
    () => () => {
      if (unlockTimer.current !== null) window.clearTimeout(unlockTimer.current)
    },
    [],
  )

  const maxOffset = 1
  const cardSpacing = Math.max(16, Math.round(cardWidth * (compact ? 0.42 : 0.64)))
  const stepDeg = compact ? 6 : 9
  const stageExtra = compact ? 20 : 100

  const prev = useCallback(() => {
    if (!len) return
    setActive((current) => wrapIndex(current - 1, len))
  }, [len])

  const next = useCallback(() => {
    if (!len) return
    setActive((current) => wrapIndex(current + 1, len))
  }, [len])

  const select = useCallback(
    (index: number) => {
      const now = Date.now()
      if (now < selectionLockedUntil.current) return

      // Lock synchronously: a second click can arrive before React commits the first update.
      selectionLockedUntil.current = now + 650
      setDragEnabled(false)
      if (unlockTimer.current !== null) window.clearTimeout(unlockTimer.current)
      unlockTimer.current = window.setTimeout(() => {
        setDragEnabled(true)
        unlockTimer.current = null
      }, 650)
      setActive(wrapIndex(index, len))
    },
    [len],
  )

  useEffect(() => {
    if (!autoAdvance || reduce || !len) return
    if (pauseOnHover && hovering) return

    const id = window.setInterval(next, Math.max(900, intervalMs))
    return () => window.clearInterval(id)
  }, [autoAdvance, intervalMs, hovering, pauseOnHover, reduce, len, next])

  if (!len) return null

  return (
    <div
      className={cn('card-stack', className)}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <div
        className="card-stack-stage"
        style={{ height: cardHeight + stageExtra, perspective: compact ? 'none' : '1100px' }}
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === 'ArrowLeft') prev()
          if (event.key === 'ArrowRight') next()
        }}
      >
        <div className="card-stack-glow" aria-hidden="true" />

        <div className="card-stack-deck">
          <AnimatePresence initial={false}>
            {items.map((item, index) => {
              const offset = signedOffset(index, active, len)
              if (Math.abs(offset) > maxOffset) return null

              const isActive = offset === 0
              const rotateZ = offset * stepDeg
              const x = offset * cardSpacing
              const y = compact ? 0 : Math.abs(offset) * 34
              const scale = isActive ? 1 : compact ? 0.9 : 0.86
              const lift = compact ? 0 : isActive ? -12 : 0

              const dragProps = isActive && !reduce && dragEnabled
                ? {
                    drag: 'x' as const,
                    dragConstraints: { left: 0, right: 0 },
                    dragElastic: 0.18,
                    onDragEnd: (
                      _event: unknown,
                      info: { offset: { x: number }; velocity: { x: number } },
                    ) => {
                      const threshold = Math.min(140, cardWidth * 0.22)
                      if (info.offset.x > threshold || info.velocity.x > 650) prev()
                      else if (info.offset.x < -threshold || info.velocity.x < -650) next()
                    },
                  }
                : {}

              return (
                <motion.div
                  key={item.id}
                  className={cn('card-stack-card', isActive && 'card-stack-card--active')}
                  style={{
                    left: '50%',
                    marginLeft: -cardWidth / 2,
                    width: cardWidth,
                    height: cardHeight,
                    zIndex: isActive ? 300 : 80 - Math.abs(offset),
                    touchAction: 'pan-y',
                  }}
                  initial={
                    reduce ? false : { opacity: 0, y: y + 32, x, rotateZ, scale }
                  }
                  animate={{ opacity: 1, x, y: y + lift, rotateZ, scale }}
                  transition={{ type: 'spring', stiffness: 280, damping: 28 }}
                  onClick={() => {
                    if (!isActive) select(index)
                  }}
                  {...dragProps}
                >
                  <div className="card-stack-card-inner">
                    {renderCard ? renderCard(item, { active: isActive }) : null}
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      </div>

      {showDots ? (
        <div className="card-stack-dots">
          {items.map((item, index) => (
            <button
              key={item.id}
              type="button"
              className={cn('card-stack-dot', index === active && 'card-stack-dot--active')}
              aria-label={`Go to ${item.title}`}
              onClick={() => {
                if (index !== active) select(index)
              }}
            />
          ))}
        </div>
      ) : null}
    </div>
  )
}

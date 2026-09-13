'use client'

import { Fragment, useMemo, useRef } from 'react'
import { motion, useInView, useReducedMotion } from 'motion/react'
import { useMediaQuery } from '@/shared/hooks'

const EASE = [0.23, 1, 0.32, 1] as const
const DURATION = 0.6
const MOBILE_DURATION = 0.32

const HIDDEN = { opacity: 0, y: 10, filter: 'blur(8px)' } as const
const SHOWN = { opacity: 1, y: 0, filter: 'blur(0px)' } as const

export type TextRevealSplit = 'word' | 'character'

type TextRevealUnit = {
  key: string
  text: string
  index: number
}

type TextRevealGroup = {
  key: string
  units: TextRevealUnit[]
}

export type TextRevealProps = {
  text: string
  by?: TextRevealSplit
  stagger?: number
  maxDuration?: number
  startOnView?: boolean
  play?: boolean
  once?: boolean
  amount?: number
  className?: string
}

export function TextReveal({
  text,
  by = 'word',
  stagger = 0.055,
  maxDuration = 1.6,
  startOnView = true,
  play = true,
  once = true,
  amount = 0.35,
  className = '',
}: TextRevealProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const compact = useMediaQuery('(max-width: 899px)')
  const inView = useInView(ref, {
    once,
    amount: compact ? 0.02 : amount,
    margin: compact ? '0px 0px 28% 0px' : '0px',
  })
  const reduced = useReducedMotion()
  const playDuration = compact ? MOBILE_DURATION : DURATION

  const { groups, step, started } = useMemo(() => {
    const words = text.trim().length ? text.trim().split(/\s+/) : []

    let index = 0
    const built: TextRevealGroup[] = words.map((word, w) => {
      if (by === 'character') {
        return {
          key: `w${w}`,
          units: Array.from(word).map((char, c) => ({
            key: `w${w}c${c}`,
            text: char,
            index: index++,
          })),
        }
      }
      return {
        key: `w${w}`,
        units: [{ key: `w${w}`, text: word, index: index++ }],
      }
    })

    const total = index
    const span = Math.max(0, (compact ? Math.min(maxDuration, 0.85) : maxDuration) - playDuration)
    const stepValue = total > 1 ? Math.min(compact ? Math.min(stagger, 0.028) : stagger, span / (total - 1)) : 0

    return {
      groups: built,
      step: stepValue,
      started: play && (!startOnView || inView),
    }
  }, [text, by, stagger, maxDuration, play, startOnView, inView, compact, playDuration])

  return (
    <span ref={ref} className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {groups.map((group, g) => (
          <Fragment key={group.key}>
            {g > 0 ? ' ' : null}
            <span className="inline-block whitespace-nowrap align-baseline">
              {group.units.map((unit) => (
                <motion.span
                  key={unit.key}
                  className="inline-block align-baseline"
                  initial={reduced ? false : HIDDEN}
                  animate={started ? SHOWN : HIDDEN}
                  transition={
                    reduced
                      ? { duration: 0 }
                      : {
                          duration: playDuration,
                          ease: EASE,
                          delay: started ? unit.index * step : 0,
                        }
                  }
                >
                  {unit.text}
                </motion.span>
              ))}
            </span>
          </Fragment>
        ))}
      </span>
    </span>
  )
}

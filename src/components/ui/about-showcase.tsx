'use client'

import { cn } from '@/lib/utils'
import { useI18n } from '@/i18n/I18nProvider'
import { Cloud, KeyRound, Link2, MessagesSquare } from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'
import { useMemo, type ComponentType, type PointerEvent, type SVGProps } from 'react'

type ShowcaseItem = {
  id: string
  icon: ComponentType<SVGProps<SVGSVGElement>>
  title: string
  description: string
  visual?: 'status' | 'nodes'
}

const SHOWCASE_ICONS = [Cloud, KeyRound, Link2, MessagesSquare] as const
const SHOWCASE_IDS = ['hosted', 'ownership', 'connected', 'thread'] as const
const SHOWCASE_VISUALS: Array<'status' | 'nodes' | undefined> = ['status', undefined, 'nodes', undefined]

function StatusVisual() {
  const { t } = useI18n()

  return (
    <div className="about-showcase-status" aria-hidden="true">
      <span className="about-showcase-status-dot" />
      <span>{t.about.status[0]}</span>
      <span className="about-showcase-status-sep">·</span>
      <span>{t.about.status[1]}</span>
      <span className="about-showcase-status-sep">·</span>
      <span>{t.about.status[2]}</span>
    </div>
  )
}

function NodesVisual() {
  return (
    <svg className="about-showcase-nodes" viewBox="0 0 120 32" aria-hidden="true">
      <circle cx="16" cy="16" r="4" fill="currentColor" opacity="0.35" />
      <circle cx="60" cy="16" r="5" fill="currentColor" opacity="0.55" />
      <circle cx="104" cy="16" r="4" fill="currentColor" opacity="0.35" />
      <path
        d="M20 16 H55 M65 16 H100"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.25"
        strokeLinecap="round"
      />
    </svg>
  )
}

function ShowcaseTile({ item, index }: { item: ShowcaseItem; index: number }) {
  const reduce = useReducedMotion()

  const handlePointerMove = (event: PointerEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    event.currentTarget.style.setProperty('--mx', `${event.clientX - rect.left}px`)
    event.currentTarget.style.setProperty('--my', `${event.clientY - rect.top}px`)
  }

  return (
    <motion.article
      className={cn('about-showcase-tile group', item.visual && `about-showcase-tile--${item.visual}`)}
      onPointerMove={handlePointerMove}
      initial={reduce ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.23, 1, 0.32, 1] }}
    >
      <span className="about-showcase-spotlight" aria-hidden="true" />
      <span className="about-showcase-cross about-showcase-cross--tl" aria-hidden="true" />
      <span className="about-showcase-cross about-showcase-cross--br" aria-hidden="true" />

      <div className="about-showcase-icon">
        <item.icon strokeWidth={1.5} aria-hidden="true" />
      </div>

      <div className="about-showcase-copy">
        <h3>{item.title}</h3>
        <p>{item.description}</p>
      </div>

      {item.visual === 'status' ? <StatusVisual /> : null}
      {item.visual === 'nodes' ? <NodesVisual /> : null}
    </motion.article>
  )
}

export function AboutShowcase() {
  const { t } = useI18n()

  const showcase = useMemo<ShowcaseItem[]>(
    () =>
      t.about.showcase.map((item, index) => ({
        id: SHOWCASE_IDS[index],
        icon: SHOWCASE_ICONS[index],
        title: item.title,
        description: item.description,
        visual: SHOWCASE_VISUALS[index],
      })),
    [t],
  )

  return (
    <div className="about-showcase">
      {showcase.map((item, index) => (
        <ShowcaseTile key={item.id} item={item} index={index} />
      ))}
    </div>
  )
}

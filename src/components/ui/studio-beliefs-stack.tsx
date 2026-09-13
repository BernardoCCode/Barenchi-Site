'use client'

import { CardStack, type CardStackItem } from '@/components/ui/card-stack'
import { useI18n } from '@/i18n/I18nProvider'
import { useEffect, useMemo, useState } from 'react'

function BeliefCard({ item }: { item: CardStackItem }) {
  return (
    <article className="studio-stack-card">
      <span className="studio-stack-watermark" aria-hidden="true">
        {item.number}
      </span>
      <div className="studio-stack-body">
        <span className="studio-stack-num">{item.number}</span>
        <h3>{item.title}</h3>
        <p>{item.description}</p>
        {item.tag ? <span className="studio-stack-tag">{item.tag}</span> : null}
      </div>
    </article>
  )
}

export function StudioBeliefsStack() {
  const { t, locale } = useI18n()
  const [cardWidth, setCardWidth] = useState(260)
  const [compact, setCompact] = useState(true)
  const cardHeight = compact ? (locale === 'pt-BR' ? 228 : 210) : locale === 'pt-BR' ? 380 : 360

  const beliefs = useMemo<CardStackItem[]>(
    () =>
      t.studio.beliefs.map((belief, index) => ({
        id: ['spec', 'core', 'ownership'][index],
        number: `0${index + 1}`,
        title: belief.title,
        description: belief.description,
        tag: belief.tag,
      })),
    [t],
  )

  useEffect(() => {
    const update = () => {
      const narrow = window.innerWidth < 768
      setCompact(narrow)
      setCardWidth(
        narrow
          ? Math.min(268, Math.max(220, window.innerWidth - 88))
          : Math.min(400, Math.max(280, window.innerWidth - 80)),
      )
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  return (
    <div className="studio-stack">
      <CardStack
        items={beliefs}
        cardWidth={cardWidth}
        cardHeight={cardHeight}
        compact={compact}
        autoAdvance
        intervalMs={5000}
        pauseOnHover
        renderCard={(item) => <BeliefCard item={item} />}
      />
    </div>
  )
}

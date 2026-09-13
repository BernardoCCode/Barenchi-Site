'use client'

import { CardStack, type CardStackItem } from '@/components/ui/card-stack'
import { useI18n } from '@/i18n/I18nProvider'
import { useEffect, useMemo, useState } from 'react'

function BeliefCard({ item, active }: { item: CardStackItem; active: boolean }) {
  return (
    <article className="studio-stack-card" data-active={active ? 'on' : 'off'}>
      <span className="studio-stack-watermark" aria-hidden="true">
        {item.number}
      </span>
      <div className="studio-stack-body" aria-hidden={!active}>
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
  const cardHeight = compact ? (locale === 'pt-BR' ? 300 : 276) : locale === 'pt-BR' ? 380 : 360

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
          ? Math.max(236, Math.min(268, window.innerWidth - 110))
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
        renderCard={(item, { active }) => <BeliefCard item={item} active={active} />}
      />
    </div>
  )
}

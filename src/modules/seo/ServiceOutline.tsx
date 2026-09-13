import { useI18n } from '@/i18n/I18nProvider'
import { HOME_SOLUTION_IDS } from '@/shared/constants'
import './seo-page.css'

export function ServiceOutline() {
  const { t } = useI18n()

  return (
    <section className="seo-outline wrap" aria-label={t.pages.services.outlineLabel}>
      {HOME_SOLUTION_IDS.map((id) => {
        const item = t.services.home[id]
        return (
          <article key={id}>
            <h2>{item.title}</h2>
            <p>{item.lead}</p>
            <ul>
              {item.notes.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
          </article>
        )
      })}
    </section>
  )
}

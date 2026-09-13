import { About, Process, Studio } from '@/modules/home'
import { PageIntro } from '@/modules/seo'
import { useI18n } from '@/i18n/I18nProvider'

export function AboutPage() {
  const { t } = useI18n()

  return (
    <div className="seo-page">
      <PageIntro
        heading={t.pages.about.heading}
        lead={t.pages.about.lead}
        crumb={t.pages.about.crumb}
      />
      <About />
      <Studio />
      <Process />
    </div>
  )
}

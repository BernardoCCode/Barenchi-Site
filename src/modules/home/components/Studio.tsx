import { StudioBeliefsStack } from '@/components/ui/studio-beliefs-stack'
import { TextReveal } from '@/components/ui/text-reveal'
import { useI18n } from '@/i18n/I18nProvider'
import { Button } from '@/shared/components/Button'
import { ROUTES } from '@/shared/constants'
import './Studio.css'

export function Studio() {
  const { t } = useI18n()

  return (
    <section className="studio" id="studio">
      <div className="wrap studio-shell">
        <header className="studio-lead">
          <div className="studio-kicker-row" aria-hidden="true">
            <span className="studio-kicker-line" />
            <p className="studio-kicker">{t.studio.kicker}</p>
            <span className="studio-kicker-line" />
          </div>

          <h2>
            <span>
              <TextReveal text={t.studio.headline[0]} startOnView />
            </span>
            <span className="studio-soft">
              <TextReveal text={t.studio.headline[1]} startOnView stagger={0.04} />
            </span>
          </h2>

          <p className="studio-intro">{t.studio.intro}</p>

          <div className="studio-action">
            <Button href={ROUTES.hashes.contact} showArrow className="studio-cta">
              {t.common.startProject}
            </Button>
          </div>
        </header>

        <StudioBeliefsStack />
      </div>
    </section>
  )
}

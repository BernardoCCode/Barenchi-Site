import { AboutShowcase } from '@/components/ui/about-showcase'
import { TextReveal } from '@/components/ui/text-reveal'
import { useI18n } from '@/i18n/I18nProvider'
import './About.css'

export function About() {
  const { t } = useI18n()

  return (
    <section className="about" id="about">
      <div className="wrap about-shell">
        <div className="about-copy">
          <h2>
            <span>
              <TextReveal text={t.about.headline[0]} startOnView />
            </span>
            <span className="about-soft">
              <TextReveal text={t.about.headline[1]} startOnView stagger={0.04} />
            </span>
          </h2>

          <AboutShowcase />
        </div>
      </div>
    </section>
  )
}

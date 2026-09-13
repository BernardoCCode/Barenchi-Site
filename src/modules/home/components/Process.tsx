import { TextReveal } from '@/components/ui/text-reveal'
import { useI18n } from '@/i18n/I18nProvider'
import { Cloud, Ear, Layers, PencilLine } from 'lucide-react'
import type { ComponentType, SVGProps } from 'react'
import './Process.css'

const STEP_ICONS: ComponentType<SVGProps<SVGSVGElement>>[] = [Ear, PencilLine, Layers, Cloud]

export function Process() {
  const { t } = useI18n()

  return (
    <section className="process" id="process">
      <div className="wrap process-shell">
        <header className="process-head">
          <div className="process-headline">
            <p className="process-kicker">{t.process.kicker}</p>
            <h2>
              <span>
                <TextReveal text={t.process.headline[0]} startOnView />
              </span>
              <span className="process-soft">
                <TextReveal text={t.process.headline[1]} startOnView stagger={0.04} />
              </span>
            </h2>
          </div>
          <p className="process-lead">{t.process.lead}</p>
        </header>

        <div className="process-track">
          <div className="process-rail" aria-hidden="true">
            <span className="process-rail-fill" />
          </div>

          <ol className="process-grid">
            {t.process.steps.map((step, index) => {
              const Icon = STEP_ICONS[index]
              return (
                <li className="process-item" key={step.title}>
                  <div className="process-node">
                    <Icon strokeWidth={1.5} aria-hidden="true" />
                    <span>{`0${index + 1}`}</span>
                  </div>
                  <h3>{step.title}</h3>
                  <p>{step.copy}</p>
                </li>
              )
            })}
          </ol>
        </div>
      </div>
    </section>
  )
}

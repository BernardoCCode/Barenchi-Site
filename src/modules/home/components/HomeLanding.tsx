import { BarenchiHero } from '@/components/hero/BarenchiHero'
import { ServiceSections } from '@/components/services/ServiceSections'
import { CustomCursor } from '@/components/UI/CustomCursor'
import { About } from './About'
import { Faqs } from './Faqs'
import { FinalCta } from './FinalCta'
import { Process } from './Process'
import { Studio } from './Studio'

export function HomeLanding() {
  return (
    <>
      <CustomCursor />
      <BarenchiHero />
      <ServiceSections />
      <Studio />
      <Process />
      <About />
      <Faqs />
      <FinalCta />
    </>
  )
}

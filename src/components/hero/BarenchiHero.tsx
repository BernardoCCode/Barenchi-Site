import gsap from 'gsap'
import { useEffect, useLayoutEffect, useRef } from 'react'
import { useHeroCapabilities, useHomeSolutions, useI18n } from '@/i18n/I18nProvider'
import { useMediaQuery } from '@/shared/hooks'
import { HeroCopy } from './HeroCopy'
import './BarenchiHero.css'

function constrainedNetwork() {
  const connection = (
    navigator as Navigator & {
      connection?: { saveData?: boolean; effectiveType?: string }
    }
  ).connection
  if (!connection) return false
  if (connection.saveData) return true
  return connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g'
}

export function BarenchiHero() {
  const { t } = useI18n()
  const reduced = useMediaQuery('(prefers-reduced-motion: reduce)')
  const rootRef = useRef<HTMLElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const homeSolutions = useHomeSolutions()
  const capabilities = useHeroCapabilities(homeSolutions)

  useLayoutEffect(() => {
    const root = rootRef.current
    if (!root) return

    const ctx = gsap.context(() => {
      const media = gsap.matchMedia()

      media.add('(prefers-reduced-motion: no-preference)', () => {
        const cols = gsap.utils.toArray<HTMLElement>('[data-anim="title-col"]')
        const rail = root.querySelector('[data-anim="rail"]')

        const timeline = gsap.timeline({ defaults: { ease: 'power3.out' } })
        timeline
          .fromTo(cols, { y: 18, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.9, stagger: 0.08 }, 0.12)
          .fromTo(rail, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.55 }, 0.42)
      })
    }, root)

    return () => ctx.revert()
  }, [])

  useEffect(() => {
    const video = videoRef.current
    if (!video || reduced) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          void video.play().catch(() => {})
          return
        }
        video.pause()
      },
      { threshold: 0.2 },
    )

    observer.observe(video)
    return () => observer.disconnect()
  }, [reduced])

  return (
    <section className="bhero" id="hero" ref={rootRef}>
      <div className="bhero-frame">
        <video
          ref={videoRef}
          className="bhero-film"
          src="/hero.mp4?v=native"
          poster="/hero-poster.jpg?v=clean"
          autoPlay={!reduced}
          muted
          loop
          playsInline
          preload={constrainedNetwork() ? 'metadata' : 'auto'}
          title={t.hero.film}
          aria-label={t.hero.film}
        />
        <HeroCopy />
      </div>

      <p className="visually-hidden">{capabilities}</p>
    </section>
  )
}

import gsap from 'gsap'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollToPlugin, ScrollTrigger)

function navOffset() {
  const raw = getComputedStyle(document.documentElement).getPropertyValue('--nav-h')
  const nav = Number.parseFloat(raw) || 76
  return nav + 12
}

function targetY(id: string) {
  if (id === 'top') return 0
  const el = document.getElementById(id)
  if (!el) return null
  return Math.max(0, el.getBoundingClientRect().top + window.scrollY - navOffset())
}

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function scrollToHash(hash: string, options?: { instant?: boolean }) {
  const id = decodeURIComponent(hash.replace(/^#/, ''))
  if (!id) return

  const y = targetY(id)
  if (y == null) return

  gsap.killTweensOf(window)

  if (options?.instant || prefersReducedMotion()) {
    window.scrollTo({ top: y, behavior: 'instant' })
    ScrollTrigger.refresh()
    return
  }

  // Let the browser handle touch scrolling and its changing toolbar viewport.
  // GSAP autoKill can mistake those position changes for a user interruption.
  const compact = window.matchMedia('(max-width: 899px)').matches
  if (compact) {
    window.scrollTo({ top: y, behavior: 'smooth' })
    return
  }

  const distance = Math.abs(y - window.scrollY)
  if (distance < 4) return

  const viewports = distance / Math.max(window.innerHeight, 1)
  const duration = gsap.utils.clamp(0.95, 2.8, 0.78 * viewports)

  gsap.to(window, {
    duration,
    ease: 'power2.inOut',
    overwrite: true,
    scrollTo: { y, autoKill: true },
    onComplete() {
      ScrollTrigger.refresh()
    },
  })
}

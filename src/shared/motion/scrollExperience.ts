import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

type RevealOpts = {
  y: number
  duration: number
  scale?: number
  stagger?: number
  start?: string
  fade?: boolean
}

function reveal(elements: Element[], trigger: Element, opts: RevealOpts) {
  if (!elements.length) return

  gsap.set(elements, { animation: 'none' })

  gsap.fromTo(
    elements,
    {
      autoAlpha: opts.fade === false ? 1 : 0,
      y: opts.y,
      ...(opts.scale != null ? { scale: opts.scale } : {}),
    },
    {
      autoAlpha: 1,
      y: 0,
      ...(opts.scale != null ? { scale: 1 } : {}),
      duration: opts.duration,
      ease: 'power2.out',
      stagger: opts.stagger ?? 0,
      overwrite: 'auto',
      immediateRender: true,
      onComplete() {
        gsap.set(elements, { clearProps: 'transform' })
      },
      scrollTrigger: {
        trigger,
        start: opts.start ?? 'top 78%',
        once: true,
        toggleActions: 'play none none none',
      },
    },
  )
}

function setupReveals(compact: boolean) {
  const y = compact ? 10 : 22
  const yTitle = compact ? 8 : 18
  const yImage = compact ? 12 : 26
  const duration = compact ? 0.32 : 0.7
  const imageDuration = compact ? 0.34 : 0.75
  // Mobile flick-scroll outruns a mid-viewport start; begin as the block
  // approaches the screen so items are already visible when they arrive.
  const intoView = compact ? 'top 96%' : 'top 72%'
  const firstView = compact ? 'top 98%' : 'top 72%'

  const catalog = document.querySelector('.catalog')
  if (catalog) {
    const head = catalog.querySelector('.catalog-head')
    const index = catalog.querySelector('.stage-index')
    const panel = catalog.querySelector('.stage-panel')
    const visual = catalog.querySelector('.stage-visual')
    const copy = catalog.querySelector('.stage-copy')

    if (head) reveal([head], head, { y: yTitle, duration, start: firstView })
    if (index) reveal([index], index, { y, duration, start: intoView })
    if (visual) {
      reveal([visual], visual, {
        y: yImage,
        duration: imageDuration,
        scale: compact ? undefined : 0.98,
        start: intoView,
      })
    }
    if (copy) reveal([copy], copy, { y, duration, start: intoView })
    if (!visual && !copy && panel) reveal([panel], panel, { y, duration, start: intoView })
  }

  const studio = document.querySelector('.studio')
  if (studio) {
    const lead = studio.querySelector<HTMLElement>('.studio-lead')
    const beliefs = gsap.utils.toArray<HTMLElement>(studio.querySelectorAll('.studio-stack'))
    if (lead) reveal([lead], lead, { y: yTitle, duration, start: firstView })
    beliefs.forEach((item) => {
      reveal([item], item, { y, duration, start: intoView })
    })
  }

  const process = document.querySelector('.process')
  if (process) {
    const head = process.querySelector<HTMLElement>('.process-head')
    const rail = process.querySelector<HTMLElement>('.process-rail-fill')
    const items = gsap.utils.toArray<HTMLElement>(process.querySelectorAll('.process-item'))
    if (head) reveal([head], head, { y: yTitle, duration, start: firstView })
    if (rail) {
      gsap.fromTo(
        rail,
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: process,
            start: compact ? 'top 88%' : 'top 68%',
            end: 'bottom 50%',
            scrub: compact ? true : 0.4,
          },
        },
      )
    }
    items.forEach((item) => {
      reveal([item], item, { y, duration, start: intoView })
    })
  }

  const about = document.querySelector('.about')
  if (about) {
    const heading = about.querySelector('h2')
    if (heading) reveal([heading], heading, { y: yTitle, duration, fade: false })
  }

  const faqs = document.querySelector('.faqs')
  if (faqs) {
    const lead = faqs.querySelector('.faqs-lead')
    if (lead) reveal([lead], lead, { y: yTitle, duration, fade: false })
  }

  const closer = document.querySelector('.close')
  if (closer) {
    const copyBlock = closer.querySelector('.close-inner > div')
    const action = closer.querySelector('.close-inner .talk')
    if (copyBlock) reveal([copyBlock], copyBlock, { y: yTitle, duration })
    if (action) reveal([action], action, { y, duration })
  }

  const inner = document.querySelector('.inner-page')
  if (inner) {
    const heading = inner.querySelector('h1')
    const rest = gsap.utils.toArray<Element>(inner.querySelectorAll(':scope > p'))
    if (heading) reveal([heading], heading, { y: yTitle, duration })
    if (rest.length) reveal(rest, rest[0], { y, duration })
  }
}

export function initScrollExperience() {
  const ctx = gsap.context(() => {
    const compact = window.matchMedia('(max-width: 899px)').matches
    setupReveals(compact)
  })

  let active = true
  const refresh = () => {
    if (active) ScrollTrigger.refresh()
  }
  const frame = requestAnimationFrame(refresh)
  void document.fonts?.ready.then(refresh)
  window.addEventListener('load', refresh)

  return () => {
    active = false
    cancelAnimationFrame(frame)
    window.removeEventListener('load', refresh)
    ctx.revert()
  }
}

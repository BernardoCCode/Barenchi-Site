import { animate, motion, useMotionTemplate, useMotionValue, useReducedMotion } from 'motion/react'
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
  type RefObject,
} from 'react'
import { AnimatedBeam } from '@/components/services/AnimatedBeam'
import { useHomeSolutions, useI18n } from '@/i18n/I18nProvider'
import { TalkLink } from '@/shared/components/TalkLink'
import { HOME_SOLUTION_IDS, sectionId, type ServiceId } from '@/shared/constants'
import type { HomeSolutionId } from '@/i18n/types'
import './ServiceSections.css'

type HomeSolution = {
  id: HomeSolutionId
  number: string
  title: string
}

function readHashId(): ServiceId {
  const hash = window.location.hash.replace(/^#/, '')
  const match = HOME_SOLUTION_IDS.find((id) => sectionId(id) === hash)
  return match ?? 'landing'
}

function CaseFrame({
  live,
  index,
  className,
  children,
}: {
  live: boolean
  index: string
  className: string
  children: ReactNode
}) {
  return (
    <div className={`case-visual ${className}`} aria-hidden="true" data-live={live ? 'on' : 'off'}>
      <span className="case-index">{index}</span>
      <span className="case-corners">
        <i />
        <i />
        <i />
        <i />
      </span>
      <div className="case-plate">{children}</div>
    </div>
  )
}

function LandingStudy({ live }: { live: boolean }) {
  const { t } = useI18n()
  const demo = t.services.demo.landing

  return (
    <CaseFrame live={live} index="01" className="case-study">
      <div className="browser">
        <div className="browser-bar">
          <span className="browser-dots">
            <i />
            <i />
            <i />
          </span>
          <span className="browser-url">
            <svg viewBox="0 0 16 16" fill="none" aria-hidden>
              <rect x="3.5" y="7" width="9" height="7" stroke="currentColor" strokeWidth="1.1" />
              <path d="M5.5 7V5.2a2.5 2.5 0 0 1 5 0V7" stroke="currentColor" strokeWidth="1.1" />
            </svg>
            barenchi.tech
          </span>
        </div>
        <div className="browser-page">
          <div className="study-top">
            <span className="study-mark">Barenchi</span>
            <span className="study-nav">{demo.nav}</span>
          </div>
          <div className="study-hero">
            <p className="study-display">
              {demo.display[0]}
              <span>{demo.display[1]}</span>
            </p>
            <p className="study-aside">{demo.aside}</p>
            <span className="study-cta">
              {demo.cta}
              <svg viewBox="0 0 24 24" fill="none">
                <path
                  d="M6 12h12M13 6l6 6-6 6"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </div>
          <div className="study-beats">
            {demo.beats.map((beat, index) => (
              <span className="study-beat" key={beat.label}>
                <span className="study-beat-head">
                  <b>{`0${index + 1}`}</b>
                  <span>{beat.label}</span>
                </span>
                <em>{beat.detail}</em>
              </span>
            ))}
          </div>
        </div>
      </div>
    </CaseFrame>
  )
}

function SystemsModel({ live }: { live: boolean }) {
  const { t } = useI18n()
  const demo = t.services.demo.systems
  const box = useRef<HTMLDivElement>(null)
  const hub = useRef<HTMLDivElement>(null)
  const finance = useRef<HTMLDivElement>(null)
  const sales = useRef<HTMLDivElement>(null)
  const ops = useRef<HTMLDivElement>(null)
  const rules = useRef<HTMLDivElement>(null)
  const api = useRef<HTMLDivElement>(null)
  const data = useRef<HTMLDivElement>(null)

  return (
    <CaseFrame live={live} index="02" className="case-model">
      <div className="model-board" ref={box}>
        <div className="model-ring">
          <div className="model-node" ref={finance}>
            <b>01</b>
            {demo.nodes[0]}
          </div>
          <div className="model-node" ref={sales}>
            <b>02</b>
            {demo.nodes[1]}
          </div>
          <div className="model-node" ref={ops}>
            <b>03</b>
            {demo.nodes[2]}
          </div>
        </div>
        <div className="model-node model-origin" ref={hub}>
          {demo.hub}
        </div>
        <div className="model-ring">
          <div className="model-node" ref={rules}>
            <b>04</b>
            {demo.nodes[3]}
          </div>
          <div className="model-node" ref={api}>
            <b>05</b>
            {demo.nodes[4]}
          </div>
          <div className="model-node" ref={data}>
            <b>06</b>
            {demo.nodes[5]}
          </div>
        </div>
        {live ? (
          <>
            <AnimatedBeam containerRef={box} fromRef={finance} toRef={hub} curvature={36} delay={0} />
            <AnimatedBeam containerRef={box} fromRef={sales} toRef={hub} delay={0.25} />
            <AnimatedBeam containerRef={box} fromRef={ops} toRef={hub} curvature={-36} delay={0.5} />
            <AnimatedBeam containerRef={box} fromRef={hub} toRef={rules} curvature={28} delay={0.75} reverse />
            <AnimatedBeam containerRef={box} fromRef={hub} toRef={api} delay={1} reverse />
            <AnimatedBeam containerRef={box} fromRef={hub} toRef={data} curvature={-28} delay={1.25} reverse />
          </>
        ) : null}
      </div>
      <p className="case-foot">{demo.foot}</p>
    </CaseFrame>
  )
}

function FlowArrow({
  live,
  cursor,
  containerRef,
  nodeRefs,
}: {
  live: boolean
  cursor: number
  containerRef: RefObject<HTMLDivElement | null>
  nodeRefs: readonly RefObject<HTMLSpanElement | null>[]
}) {
  const reduce = useReducedMotion()
  const [pathD, setPathD] = useState('')
  const [size, setSize] = useState({ width: 0, height: 0 })

  useEffect(() => {
    const update = () => {
      const container = containerRef.current
      if (!container) return
      const box = container.getBoundingClientRect()
      const pts: Array<[number, number]> = []
      for (const ref of nodeRefs) {
        const node = ref.current
        if (!node) return
        const rect = node.getBoundingClientRect()
        pts.push([rect.left - box.left + rect.width / 2, rect.top - box.top + rect.height / 2])
      }
      setSize({ width: box.width, height: box.height })
      setPathD(pts.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point[0]},${point[1]}`).join(' '))
    }

    const observer = new ResizeObserver(update)
    if (containerRef.current) observer.observe(containerRef.current)
    update()
    const raf = window.requestAnimationFrame(update)
    const later = window.setTimeout(update, 650)
    return () => {
      observer.disconnect()
      window.cancelAnimationFrame(raf)
      window.clearTimeout(later)
    }
  }, [containerRef, nodeRefs])

  if (!pathD || size.width === 0) return null

  const last = Math.max(nodeRefs.length - 1, 1)
  const distance = `${(cursor / last) * 100}%`

  return (
    <>
      <svg
        className="beam-svg flow-wire"
        width={size.width}
        height={size.height}
        viewBox={`0 0 ${size.width} ${size.height}`}
        fill="none"
        aria-hidden
      >
        <path d={pathD} stroke="var(--line)" strokeWidth="1" strokeLinecap="round" />
      </svg>
      {live && reduce !== true ? (
        <motion.span
          className="flow-arrow"
          style={{ offsetPath: `path('${pathD}')` }}
          initial={false}
          animate={{ offsetDistance: distance }}
          transition={cursor === 0 ? { duration: 0 } : { duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          aria-hidden
        />
      ) : null}
    </>
  )
}

function AutomationFlow({ live }: { live: boolean }) {
  const { t } = useI18n()
  const demo = t.services.demo.automation
  const flowEvents = demo.events.map((text, index) => ({
    at: ['09:14', '09:14', '09:15', '09:15', '09:16', '11:40'][index] ?? '09:14',
    text,
  }))
  const box = useRef<HTMLDivElement>(null)
  const a = useRef<HTMLSpanElement>(null)
  const b = useRef<HTMLSpanElement>(null)
  const c = useRef<HTMLSpanElement>(null)
  const d = useRef<HTMLSpanElement>(null)
  const e = useRef<HTMLSpanElement>(null)
  const f = useRef<HTMLSpanElement>(null)
  const steps = useRef([a, b, c, d, e, f] as const)
  const nodeRefs = steps.current
  const [cursor, setCursor] = useState(live ? 0 : flowEvents.length - 1)

  useEffect(() => {
    if (!live) return
    const id = window.setInterval(() => {
      setCursor((current) => (current + 1) % flowEvents.length)
    }, 1600)
    return () => window.clearInterval(id)
  }, [live, flowEvents.length])

  const shown = live ? flowEvents.slice(0, cursor + 1) : flowEvents

  return (
    <CaseFrame live={live} index="03" className="case-flow">
      <div className="flow-board">
        <div className="flow-shell" ref={box}>
          <ol className="flow-track">
            {demo.steps.map((step, index) => (
              <li className={index === cursor ? 'is-on' : undefined} key={`flow-${index}`}>
                <span className="flow-node" ref={nodeRefs[index]} />
                <span className="flow-copy">
                  <b>{`0${index + 1}`}</b>
                  <strong>{step.name}</strong>
                  <em>{step.kind}</em>
                </span>
              </li>
            ))}
          </ol>
          <FlowArrow live={live} cursor={cursor} containerRef={box} nodeRefs={nodeRefs} />
        </div>
        <ol className="flow-log">
          {shown.map((entry) => (
            <li key={`${entry.at}-${entry.text}`}>
              <time>{entry.at}</time>
              <span>{entry.text}</span>
            </li>
          ))}
        </ol>
      </div>
      <p className="case-foot">{demo.foot}</p>
    </CaseFrame>
  )
}

function ShirtMark() {
  return (
    <svg className="eco-shirt" viewBox="0 0 80 88" fill="none" aria-hidden>
      <path
        d="M28 14 14 22l8 10v42h36V32l8-10L52 14c-2 8-8 12-12 12s-10-4-12-12Z"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <path d="M28 14c2 6 7 9 12 9s10-3 12-9" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  )
}

function EcosystemFloor({ live }: { live: boolean }) {
  const { t } = useI18n()
  const demo = t.services.demo.ecosystems
  const floors = demo.floors.map((line, index) => ({ id: String(index), line }))
  const [room, setRoom] = useState(0)

  useEffect(() => {
    if (!live) return
    const id = window.setInterval(() => {
      setRoom((current) => (current + 1) % floors.length)
    }, 2400)
    return () => window.clearInterval(id)
  }, [live, floors.length])

  return (
    <CaseFrame live={live} index="04" className="case-eco">
      <div className="eco-stage">
        <article className={`eco-window${room === 0 ? ' is-on' : ''}`}>
          <div className="eco-bar">
            <span className="eco-mark">{demo.shop}</span>
            <span className="eco-bag">{demo.bag}</span>
          </div>
          <div className="eco-pdp">
            <div className="eco-cloth">
              <ShirtMark />
            </div>
            <div className="eco-pdp-copy">
              <span className="eco-room-id">
                <b>01</b>
                {demo.rooms[0]}
              </span>
              <p className="eco-garment">{demo.garment}</p>
              <span className="eco-buy">
                {demo.buy}
                <svg viewBox="0 0 24 24" fill="none">
                  <path
                    d="M6 12h12M13 6l6 6-6 6"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </div>
          </div>
        </article>

        <div className="eco-ops">
          <article className={`eco-slip${room === 1 ? ' is-on' : ''}`}>
            <span className="eco-room-id">
              <b>02</b>
              {demo.rooms[1]}
            </span>
            <ul className="eco-lines">
              {demo.checkout.map((row, index) => (
                <li key={row.label} className={index === demo.checkout.length - 1 ? 'eco-total' : undefined}>
                  <span>{row.label}</span>
                  <span>{row.value}</span>
                </li>
              ))}
            </ul>
          </article>

          <article className={`eco-shelf${room === 2 ? ' is-on' : ''}`}>
            <span className="eco-room-id">
              <b>03</b>
              {demo.rooms[2]}
            </span>
            <ul className="eco-bins">
              {demo.stock.map((row) => (
                <li key={row.label}>
                  <span>{row.label}</span>
                  <i className={`eco-fill-${row.fill}`} />
                </li>
              ))}
            </ul>
            <em>{demo.stockNote}</em>
          </article>
        </div>

        <article className={`eco-thread${room === 3 ? ' is-on' : ''}`}>
          <span className="eco-room-id">
            <b>04</b>
            {demo.rooms[3]}
          </span>
          <div className="eco-notes">
            {demo.afterSale.map((note) => (
              <p key={note.who}>
                <b>{note.who}</b>
                {note.text}
              </p>
            ))}
          </div>
        </article>
      </div>
      <p className="case-foot">{floors[room].line}</p>
    </CaseFrame>
  )
}

function CaseVisual({ id, live }: { id: ServiceId; live: boolean }) {
  if (id === 'landing') return <LandingStudy live={live} />
  if (id === 'systems') return <SystemsModel live={live} />
  if (id === 'automation') return <AutomationFlow live={live} />
  if (id === 'ecosystems') return <EcosystemFloor live={live} />
  return <LandingStudy live={live} />
}

function StageTab({
  service,
  selected,
  live,
  panelId,
  onSelect,
  onKeyDown,
  setTab,
}: {
  service: HomeSolution
  selected: boolean
  live: boolean
  panelId: string
  onSelect: () => void
  onKeyDown: (event: KeyboardEvent<HTMLButtonElement>) => void
  setTab: (node: HTMLButtonElement | null) => void
}) {
  const tabEl = useRef<HTMLButtonElement | null>(null)
  const xPercent = useMotionValue(0)
  const yPercent = useMotionValue(0)
  const maskImage = useMotionTemplate`radial-gradient(88px 40px at ${xPercent}% ${yPercent}%, black, transparent)`

  useEffect(() => {
    if (!tabEl.current || !selected || !live) return

    const { height, width } = tabEl.current.getBoundingClientRect()
    const circumference = height * 2 + width * 2
    const times = [
      0,
      width / circumference,
      (width + height) / circumference,
      (width * 2 + height) / circumference,
      1,
    ]

    const ax = animate(xPercent, [0, 100, 100, 0, 0], {
      duration: 5.2,
      times,
      ease: 'linear',
      repeat: Infinity,
    })
    const ay = animate(yPercent, [0, 0, 100, 100, 0], {
      duration: 5.2,
      times,
      ease: 'linear',
      repeat: Infinity,
    })

    return () => {
      ax.stop()
      ay.stop()
    }
  }, [selected, live, service.id, xPercent, yPercent])

  return (
    <button
      className={`stage-tab${selected ? ' is-on' : ''}`}
      id={sectionId(service.id)}
      ref={(node) => {
        tabEl.current = node
        setTab(node)
      }}
      type="button"
      role="tab"
      aria-selected={selected}
      aria-controls={panelId}
      tabIndex={selected ? 0 : -1}
      onClick={onSelect}
      onKeyDown={onKeyDown}
    >
      {selected ? (
        <motion.span
          className="stage-tab-orbit"
          style={live ? { maskImage, WebkitMaskImage: maskImage } : undefined}
          aria-hidden
        />
      ) : null}
      <span className="stage-tab-num">{service.number}</span>
      <span className="stage-tab-title">{service.title}</span>
    </button>
  )
}

export function ServiceSections() {
  const { t, locale } = useI18n()
  const homeSolutions = useHomeSolutions()
  const reduce = useReducedMotion()
  const panelId = useId()
  const tabs = useRef<Partial<Record<ServiceId, HTMLButtonElement | null>>>({})
  const railRef = useRef<HTMLDivElement>(null)
  const [activeId, setActiveId] = useState<ServiceId>(() => readHashId())
  const [rail, setRail] = useState({ overflow: false, start: true, end: false })
  const active = homeSolutions.find((service) => service.id === activeId) ?? homeSolutions[0]
  const cse = t.services.home[active.id as (typeof HOME_SOLUTION_IDS)[number]]
  const live = reduce !== true

  const measureRail = useCallback(() => {
    const el = railRef.current
    if (!el) return
    const max = el.scrollWidth - el.clientWidth
    setRail({
      overflow: max > 8,
      start: el.scrollLeft <= 6,
      end: el.scrollLeft >= max - 6,
    })
  }, [])

  useEffect(() => {
    setActiveId(readHashId())
  }, [locale])

  useEffect(() => {
    const el = railRef.current
    if (!el) return
    measureRail()
    el.addEventListener('scroll', measureRail, { passive: true })
    window.addEventListener('resize', measureRail)
    return () => {
      el.removeEventListener('scroll', measureRail)
      window.removeEventListener('resize', measureRail)
    }
  }, [locale, homeSolutions.length, measureRail])

  const open = (id: ServiceId, moveFocus = false) => {
    setActiveId(id)
    const tab = tabs.current[id]
    if (moveFocus) tab?.focus()
    const railEl = railRef.current
    if (tab && railEl) {
      const railBox = railEl.getBoundingClientRect()
      const tabBox = tab.getBoundingClientRect()
      railEl.scrollBy({
        left: tabBox.left - railBox.left - (railBox.width - tabBox.width) / 2,
        behavior: reduce ? 'auto' : 'smooth',
      })
    }
  }

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const last = homeSolutions.length - 1
    let next = index
    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') next = index === last ? 0 : index + 1
    else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') next = index === 0 ? last : index - 1
    else if (event.key === 'Home') next = 0
    else if (event.key === 'End') next = last
    else return
    event.preventDefault()
    open(homeSolutions[next].id, true)
  }

  return (
    <section className="catalog" id="services">
      <div className="wrap">
        <header className="catalog-head" id="capabilities-poster">
          <h2>
            <span className="catalog-line">{t.services.headline[0]}</span>
            <span className="catalog-line catalog-soft">{t.services.headline[1]}</span>
          </h2>
        </header>

        <div
          className="stage-rail"
          data-overflow={rail.overflow ? 'true' : 'false'}
          data-start={rail.start ? 'true' : 'false'}
          data-end={rail.end ? 'true' : 'false'}
        >
          <div ref={railRef} className="stage-index" role="tablist" aria-label={t.services.tablistLabel}>
            {homeSolutions.map((service, index) => (
              <StageTab
                key={service.id}
                service={service}
                selected={service.id === active.id}
                live={live}
                panelId={panelId}
                onSelect={() => open(service.id)}
                onKeyDown={(event) => onKeyDown(event, index)}
                setTab={(node) => {
                  tabs.current[service.id] = node
                }}
              />
            ))}
          </div>

          {rail.overflow ? (
            <div className="stage-guide" role="presentation">
              {homeSolutions.map((service) => (
                <button
                  key={service.id}
                  type="button"
                  className={`stage-guide-dot${service.id === active.id ? ' is-on' : ''}`}
                  aria-label={service.title}
                  onClick={() => open(service.id)}
                />
              ))}
            </div>
          ) : null}
        </div>

        <div className="stage-panel" id={panelId} role="tabpanel" aria-labelledby={sectionId(active.id)}>
          <div className="stage-visual" key={`visual-${active.id}`} data-instant={live ? undefined : 'true'}>
            <CaseVisual id={active.id} live={live} />
          </div>

          <div className="stage-copy" key={`copy-${active.id}`} data-instant={live ? undefined : 'true'}>
            <h3>{cse.headline}</h3>
            <p>{cse.lead}</p>
            <ul>
              {cse.notes.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <TalkLink />
          </div>
        </div>
      </div>
    </section>
  )
}

import { useEffect, useRef } from 'react'
import { useMediaQuery } from '@/shared/hooks'

const HOT_SELECTOR = 'a, button, [role="button"], input, textarea'

/**
 * Pointer position is written straight to the node inside a rAF loop, so the
 * cursor never triggers a React render.
 */
export function CustomCursor() {
  const fine = useMediaQuery('(hover: hover) and (pointer: fine)')
  const reduced = useMediaQuery('(prefers-reduced-motion: reduce)')
  const dotRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const dot = dotRef.current
    if (!fine || reduced || !dot) return

    document.documentElement.classList.add('has-cursor')

    const target = { x: 0, y: 0 }
    const current = { x: 0, y: 0 }
    let hot = false
    let frame = 0
    let seen = false
    dot.style.opacity = '0'

    const onMove = (event: PointerEvent) => {
      target.x = event.clientX
      target.y = event.clientY
      if (!seen) {
        seen = true
        current.x = target.x
        current.y = target.y
        dot.style.opacity = '1'
      }
      const node = event.target
      const next = node instanceof Element && Boolean(node.closest(HOT_SELECTOR))
      if (next !== hot) {
        hot = next
        dot.classList.toggle('is-hot', hot)
      }
    }

    const tick = () => {
      current.x += (target.x - current.x) * 0.28
      current.y += (target.y - current.y) * 0.28
      dot.style.setProperty('--cx', `${current.x.toFixed(1)}px`)
      dot.style.setProperty('--cy', `${current.y.toFixed(1)}px`)
      frame = requestAnimationFrame(tick)
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    frame = requestAnimationFrame(tick)

    return () => {
      document.documentElement.classList.remove('has-cursor')
      window.removeEventListener('pointermove', onMove)
      cancelAnimationFrame(frame)
    }
  }, [fine, reduced])

  if (!fine || reduced) return null

  return <div className="cursor-dot" ref={dotRef} aria-hidden="true" />
}

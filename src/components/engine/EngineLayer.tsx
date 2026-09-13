import { useEffect } from 'react'
import { EngineCanvas } from './EngineCanvas'
import { useEngine } from './EngineContext'
import { WebGlBoundary } from './WebGlBoundary'
import './EngineLayer.css'

function Fallback() {
  return (
    <div className="engine-fallback" aria-hidden="true">
      <div className="engine-fallback-body">B</div>
    </div>
  )
}

export function EngineLayer({ reduced }: { reduced: boolean }) {
  const { pointer } = useEngine()

  useEffect(() => {
    const onMove = (event: PointerEvent) => {
      const x = (event.clientX / window.innerWidth) * 2 - 1
      const y = (event.clientY / window.innerHeight) * 2 - 1
      pointer.current.x = x
      pointer.current.y = y
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [pointer])

  return (
    <div className="engine-layer" aria-hidden="true">
      <WebGlBoundary fallback={<Fallback />}>
        <EngineCanvas reduced={reduced} />
      </WebGlBoundary>
    </div>
  )
}

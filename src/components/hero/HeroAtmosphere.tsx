import { useEffect, useRef } from 'react'

export function HeroAtmosphere({ reduced }: { reduced: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let frame = 0
    let running = true

    const draw = (time: number) => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const width = canvas.clientWidth
      const height = canvas.clientHeight
      if (canvas.width !== Math.floor(width * dpr) || canvas.height !== Math.floor(height * dpr)) {
        canvas.width = Math.floor(width * dpr)
        canvas.height = Math.floor(height * dpr)
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, width, height)

      const drift = reduced ? 0 : Math.sin(time * 0.00012) * 18
      const vanishX = width * 0.72 + drift
      const vanishY = height * 0.46

      ctx.strokeStyle = 'rgba(23, 23, 23, 0.045)'
      ctx.lineWidth = 1

      const columns = 14
      for (let i = 0; i <= columns; i += 1) {
        const x = (width / columns) * i + drift * 0.15
        ctx.beginPath()
        ctx.moveTo(x, height)
        ctx.lineTo(vanishX, vanishY)
        ctx.stroke()
      }

      const rows = 10
      for (let i = 1; i <= rows; i += 1) {
        const t = i / rows
        const y = vanishY + (height - vanishY) * t * t
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(width, y)
        ctx.stroke()
      }

      ctx.beginPath()
      ctx.moveTo(0, vanishY)
      ctx.lineTo(width, vanishY)
      ctx.stroke()

      ctx.strokeStyle = 'rgba(23, 23, 23, 0.07)'
      ctx.beginPath()
      ctx.moveTo(vanishX, 0)
      ctx.lineTo(vanishX, height)
      ctx.stroke()
    }

    const tick = (time: number) => {
      if (!running) return
      draw(time)
      if (!reduced) frame = requestAnimationFrame(tick)
    }

    tick(0)
    const onResize = () => draw(0)
    window.addEventListener('resize', onResize)

    return () => {
      running = false
      cancelAnimationFrame(frame)
      window.removeEventListener('resize', onResize)
    }
  }, [reduced])

  return (
    <div className="bhero-atmosphere" aria-hidden="true">
      <canvas ref={canvasRef} />
    </div>
  )
}

import { Canvas } from '@react-three/fiber'
import { EngineScene } from './EngineScene'

export function EngineCanvas({ reduced }: { reduced: boolean }) {
  return (
    <Canvas
      dpr={[1, 1.6]}
      gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
      frameloop={reduced ? 'demand' : 'always'}
      style={{ pointerEvents: 'none', background: 'transparent' }}
      onCreated={({ gl }) => {
        gl.setClearColor(0x000000, 0)
      }}
    >
      <EngineScene reduced={reduced} />
    </Canvas>
  )
}

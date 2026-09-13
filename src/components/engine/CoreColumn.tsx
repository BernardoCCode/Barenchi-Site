import { RoundedBox } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useLayoutEffect, useMemo, useRef } from 'react'
import {
  CanvasTexture,
  Group,
  LinearFilter,
  MeshStandardMaterial,
  SRGBColorSpace,
} from 'three'
import { useEngine } from './EngineContext'
import {
  ENGINE_GLASS,
  ENGINE_WARM,
  METAL_ALUMINUM,
  METAL_BLACK,
  METAL_FRAME,
  METAL_GRAPHITE,
} from './engineConfig'
import { paintScreen } from './paintScreen'

function damp(current: number, target: number, lambda: number, dt: number) {
  return current + (target - current) * (1 - Math.exp(-lambda * Math.min(dt, 0.1)))
}

function makeFaceTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 1024
  canvas.height = 1536
  const ctx = canvas.getContext('2d')
  if (!ctx) return null
  paintScreen(ctx, canvas.width, canvas.height)
  const texture = new CanvasTexture(canvas)
  texture.colorSpace = SRGBColorSpace
  texture.minFilter = LinearFilter
  texture.magFilter = LinearFilter
  texture.anisotropy = 8
  return texture
}

export function CoreColumn({ reduced }: { reduced: boolean }) {
  const { pointer } = useEngine()
  const group = useRef<Group>(null)
  const screenMat = useRef<MeshStandardMaterial>(null)
  const face = useMemo(() => makeFaceTexture(), [])

  useLayoutEffect(() => {
    return () => {
      face?.dispose()
    }
  }, [face])

  useFrame((state, dt) => {
    const node = group.current
    if (!node) return

    const t = state.clock.elapsedTime
    const px = pointer.current.x
    const py = pointer.current.y
    const idleY = reduced ? -0.08 : Math.sin(t * 0.35) * 0.12
    const idleX = reduced ? 0 : Math.sin(t * 0.22) * 0.03
    const floatY = reduced ? 0 : Math.sin(t * 0.7) * 0.012

    node.rotation.y = damp(node.rotation.y, idleY + px * 0.22, 5.5, dt)
    node.rotation.x = damp(node.rotation.x, idleX + py * -0.1, 5.5, dt)
    node.position.y = damp(node.position.y, floatY, 3.2, dt)

    if (screenMat.current && !reduced) {
      screenMat.current.emissiveIntensity = 0.42 + Math.sin(t * 0.9) * 0.06
    }
  })

  return (
    <group ref={group} position={[0, 0.02, 0]}>
      <RoundedBox args={[0.5, 0.036, 0.24]} radius={0.008} smoothness={4} position={[0, -0.5, 0]}>
        <meshStandardMaterial color={METAL_BLACK} metalness={0.86} roughness={0.28} />
      </RoundedBox>
      <RoundedBox args={[0.12, 0.05, 0.12]} radius={0.01} smoothness={4} position={[0, -0.46, 0]}>
        <meshStandardMaterial color={METAL_GRAPHITE} metalness={0.8} roughness={0.32} />
      </RoundedBox>
      <RoundedBox args={[0.4, 0.7, 0.046]} radius={0.012} smoothness={5} position={[0, 0.02, -0.02]}>
        <meshStandardMaterial color={METAL_GRAPHITE} metalness={0.78} roughness={0.3} />
      </RoundedBox>
      <RoundedBox args={[0.03, 0.68, 0.05]} radius={0.006} smoothness={4} position={[-0.208, 0.02, 0]}>
        <meshStandardMaterial color={METAL_ALUMINUM} metalness={0.84} roughness={0.24} />
      </RoundedBox>
      <RoundedBox args={[0.03, 0.68, 0.05]} radius={0.006} smoothness={4} position={[0.208, 0.02, 0]}>
        <meshStandardMaterial color={METAL_ALUMINUM} metalness={0.84} roughness={0.24} />
      </RoundedBox>
      <RoundedBox args={[0.428, 0.728, 0.02]} radius={0.01} smoothness={5} position={[0, 0.02, 0.016]}>
        <meshStandardMaterial color={METAL_FRAME} metalness={0.7} roughness={0.22} />
      </RoundedBox>
      <mesh position={[0, 0.02, 0.028]}>
        <planeGeometry args={[0.372, 0.66]} />
        <meshStandardMaterial
          ref={screenMat}
          color={ENGINE_GLASS}
          map={face ?? undefined}
          emissiveMap={face ?? undefined}
          emissive={ENGINE_WARM}
          emissiveIntensity={0.42}
          roughness={0.18}
          metalness={0.08}
          toneMapped={false}
        />
      </mesh>
      <pointLight color={ENGINE_WARM} intensity={0.28} distance={1.6} position={[0, 0.04, -0.06]} />
    </group>
  )
}

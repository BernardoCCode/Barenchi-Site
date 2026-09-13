import { ContactShadows, PerspectiveCamera } from '@react-three/drei'
import { useThree } from '@react-three/fiber'
import { useLayoutEffect } from 'react'
import {
  CanvasTexture,
  EquirectangularReflectionMapping,
  PMREMGenerator,
  SRGBColorSpace,
} from 'three'
import { CoreColumn } from './CoreColumn'
import { CAMERA_DISTANCE, FOV } from './engineConfig'

function makeStudioTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 256
  const ctx = canvas.getContext('2d')
  if (!ctx) return null
  const sky = ctx.createLinearGradient(0, 0, 0, 256)
  sky.addColorStop(0, '#e8e4dc')
  sky.addColorStop(0.48, '#e5f3fa')
  sky.addColorStop(1, '#cfc8bc')
  ctx.fillStyle = sky
  ctx.fillRect(0, 0, 512, 256)
  const texture = new CanvasTexture(canvas)
  texture.mapping = EquirectangularReflectionMapping
  texture.colorSpace = SRGBColorSpace
  return texture
}

function StudioEnvironment() {
  const { gl, scene } = useThree()

  useLayoutEffect(() => {
    const source = makeStudioTexture()
    if (!source) return
    const pmrem = new PMREMGenerator(gl)
    const env = pmrem.fromEquirectangular(source).texture
    scene.environment = env
    source.dispose()
    pmrem.dispose()
    return () => {
      scene.environment = null
      env.dispose()
    }
  }, [gl, scene])

  return null
}

export function EngineScene({ reduced }: { reduced: boolean }) {
  return (
    <>
      <PerspectiveCamera makeDefault fov={FOV} position={[0, 0.02, CAMERA_DISTANCE]} near={0.1} far={24} />
      <StudioEnvironment />
      <ambientLight color="#e5f3fa" intensity={0.62} />
      <directionalLight color="#fff8f0" intensity={1.15} position={[-2.2, 3.4, 2.8]} />
      <directionalLight color="#e5f3fa" intensity={0.32} position={[2.4, 1.2, 1.4]} />
      <CoreColumn reduced={reduced} />
      <ContactShadows
        position={[0, -0.52, 0]}
        opacity={0.18}
        scale={3.4}
        blur={2.4}
        far={1.4}
        color="#171717"
      />
    </>
  )
}

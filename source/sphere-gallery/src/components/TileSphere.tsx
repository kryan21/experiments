import { Suspense, useMemo, useRef } from 'react'
import { Canvas, useFrame, type ThreeEvent } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import * as THREE from 'three'
import { PROJECTS, img, type Project } from '../data'

export interface DragState {
  ox: number // accumulated rotation offset X (from drag)
  oy: number // accumulated rotation offset Y
  vx: number
  vy: number
}

const R = 3.35
const GOLDEN = Math.PI * (3 - Math.sqrt(5))

/** Deterministic pseudo-random from index (stable across renders). */
const rnd = (i: number, salt: number) => {
  const x = Math.sin(i * 127.1 + salt * 311.7) * 43758.5453
  return x - Math.floor(x)
}

interface TileDef {
  project: Project
  pos: THREE.Vector3
  quat: THREE.Quaternion
  scale: number
}

function buildTiles(): TileDef[] {
  const n = PROJECTS.length
  return PROJECTS.map((project, i) => {
    const y = 1 - (i / (n - 1)) * 2
    const rad = Math.sqrt(Math.max(0, 1 - y * y))
    const theta = GOLDEN * i
    const r = R * (0.88 + rnd(i, 3) * 0.26) // loose cloud, not a perfect shell
    const pos = new THREE.Vector3(Math.cos(theta) * rad * r, y * r, Math.sin(theta) * rad * r)
    const m = new THREE.Matrix4().lookAt(new THREE.Vector3(0, 0, 0), pos.clone().negate(), new THREE.Vector3(0, 1, 0))
    const quat = new THREE.Quaternion().setFromRotationMatrix(m)
    return { project, pos, quat, scale: 0.85 + rnd(i, 7) * 0.4 }
  })
}

function Tile({
  def, texture, onSelect,
}: {
  def: TileDef
  texture: THREE.Texture
  onSelect: (p: Project) => void
}) {
  const mesh = useRef<THREE.Mesh>(null!)
  const hover = useRef(0)
  const target = useRef(1)
  useFrame(() => {
    hover.current += (target.current - hover.current) * 0.14
    const s = def.scale * (0.62 + hover.current * 0.38)
    mesh.current.scale.setScalar(s)
  })
  const over = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation()
    target.current = 1.45
    document.body.style.cursor = 'pointer'
  }
  const out = () => {
    target.current = 1
    document.body.style.cursor = ''
  }
  return (
    <mesh
      ref={mesh}
      position={def.pos}
      quaternion={def.quat}
      onPointerOver={over}
      onPointerOut={out}
      onClick={(e) => {
        e.stopPropagation()
        if (Math.abs(e.delta) < 6) onSelect(def.project)
      }}
    >
      <planeGeometry args={[1.38, 1.03]} />
      <meshBasicMaterial map={texture} side={THREE.DoubleSide} toneMapped={false} />
    </mesh>
  )
}

function Cloud({
  drag, onSelect,
}: {
  drag: React.MutableRefObject<DragState>
  onSelect: (p: Project) => void
}) {
  const group = useRef<THREE.Group>(null!)
  const spin = useRef(0)
  const tiles = useMemo(buildTiles, [])
  const textures = useTexture(PROJECTS.map((p) => img(p)))
  useMemo(() => {
    textures.forEach((t) => {
      t.colorSpace = THREE.SRGBColorSpace
      t.anisotropy = 4
    })
  }, [textures])
  useFrame(() => {
    spin.current += 0.0016
    const d = drag.current
    d.oy += d.vy
    d.ox += d.vx
    d.vx *= 0.94
    d.vy *= 0.94
    d.ox = THREE.MathUtils.clamp(d.ox, -0.9, 0.9)
    group.current.rotation.y = spin.current + d.oy
    group.current.rotation.x = d.ox
  })
  return (
    <group ref={group}>
      {tiles.map((def, i) => (
        <Tile key={def.project.id} def={def} texture={textures[i]} onSelect={onSelect} />
      ))}
    </group>
  )
}

export default function TileSphere({
  drag, onSelect,
}: {
  drag: React.MutableRefObject<DragState>
  onSelect: (p: Project) => void
}) {
  return (
    <Canvas
      dpr={[1, 1.8]}
      camera={{ position: [0, 0, 11.4], fov: 42 }}
      gl={{ antialias: true, alpha: true }}
      style={{ background: 'transparent' }}
    >
      <Suspense fallback={null}>
        <Cloud drag={drag} onSelect={onSelect} />
      </Suspense>
    </Canvas>
  )
}

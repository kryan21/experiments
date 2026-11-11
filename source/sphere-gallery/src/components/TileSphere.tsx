import { Suspense, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree, type ThreeEvent } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import * as THREE from 'three'
import { PROJECTS, img, type Project } from '../data'

export interface DragState {
  ox: number // accumulated rotation offset X (from drag)
  oy: number // accumulated rotation offset Y
  vx: number
  vy: number
}

export interface MorphState {
  value: number // 0 = sphere, 1 = opened flat gallery
  target: number
}

const R = 3.35
const GOLDEN = Math.PI * (3 - Math.sqrt(5))
const TILE_W = 1.38
const TILE_H = 1.03

/** Deterministic pseudo-random from index (stable across renders). */
const rnd = (i: number, salt: number) => {
  const x = Math.sin(i * 127.1 + salt * 311.7) * 43758.5453
  return x - Math.floor(x)
}

const easeInOut = (t: number) => t * t * (3 - 2 * t)

interface TileDef {
  project: Project
  spherePos: THREE.Vector3
  sphereQuat: THREE.Quaternion
  sphereScale: number
  gridPos: THREE.Vector3
  gridScale: number
}

function buildTiles(vw: number, vh: number): TileDef[] {
  const n = PROJECTS.length
  // --- grid layout, fitted inside the visible frustum at z = 0 ---
  const cols = vw > vh * 1.15 ? 5 : vw > vh * 0.8 ? 4 : vw > vh * 0.55 ? 3 : 2
  const rows = Math.ceil(n / cols)
  const gap = 0.16
  let cellW = Math.min(TILE_W + gap, (vw * 0.94) / cols)
  cellW = Math.min(cellW, ((vh * 0.86) / rows - gap) * (TILE_W / TILE_H) + gap)
  const cellH = ((cellW - gap) * TILE_H) / TILE_W + gap
  const gridScale = (cellW - gap) / TILE_W
  const totalW = cols * cellW - gap
  const totalH = rows * cellH - gap

  return PROJECTS.map((project, i) => {
    const y = 1 - (i / (n - 1)) * 2
    const rad = Math.sqrt(Math.max(0, 1 - y * y))
    const theta = GOLDEN * i
    const r = R * (0.88 + rnd(i, 3) * 0.26) // loose cloud, not a perfect shell
    const spherePos = new THREE.Vector3(
      Math.cos(theta) * rad * r,
      y * r,
      Math.sin(theta) * rad * r,
    )
    const m = new THREE.Matrix4().lookAt(
      new THREE.Vector3(0, 0, 0),
      spherePos.clone().negate(),
      new THREE.Vector3(0, 1, 0),
    )
    const sphereQuat = new THREE.Quaternion().setFromRotationMatrix(m)
    const col = i % cols
    const row = Math.floor(i / cols)
    const gridPos = new THREE.Vector3(
      -totalW / 2 + col * cellW + (cellW - gap) / 2,
      totalH / 2 - row * cellH - (cellH - gap) / 2,
      0,
    )
    return {
      project,
      spherePos,
      sphereQuat,
      sphereScale: 0.85 + rnd(i, 7) * 0.4,
      gridPos,
      gridScale,
    }
  })
}

const IDENTITY_Q = new THREE.Quaternion()

function Tile({
  def, texture, morph, onSelect,
}: {
  def: TileDef
  texture: THREE.Texture
  morph: React.MutableRefObject<MorphState>
  onSelect: (p: Project) => void
}) {
  const mesh = useRef<THREE.Mesh>(null!)
  const hover = useRef(0)
  const target = useRef(1)
  useFrame(() => {
    const e = easeInOut(THREE.MathUtils.clamp(morph.current.value, 0, 1))
    hover.current += (target.current - hover.current) * 0.14
    const m = mesh.current
    m.position.lerpVectors(def.spherePos, def.gridPos, e)
    m.quaternion.slerpQuaternions(def.sphereQuat, IDENTITY_Q, e)
    const sphereS = def.sphereScale * (0.62 + hover.current * 0.38)
    const s = THREE.MathUtils.lerp(sphereS, def.gridScale, e)
    m.scale.setScalar(s)
  })
  const over = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation()
    if (morph.current.value < 0.5) target.current = 1.45
    document.body.style.cursor = 'pointer'
  }
  const out = () => {
    target.current = 1
    document.body.style.cursor = ''
  }
  return (
    <mesh
      ref={mesh}
      onPointerOver={over}
      onPointerOut={out}
      onClick={(e) => {
        e.stopPropagation()
        if (Math.abs(e.delta) < 6) onSelect(def.project)
      }}
    >
      <planeGeometry args={[TILE_W, TILE_H]} />
      <meshBasicMaterial map={texture} side={THREE.DoubleSide} toneMapped={false} />
    </mesh>
  )
}

function Cloud({
  drag, morph, onSelect,
}: {
  drag: React.MutableRefObject<DragState>
  morph: React.MutableRefObject<MorphState>
  onSelect: (p: Project) => void
}) {
  const group = useRef<THREE.Group>(null!)
  const spin = useRef(0)
  const { camera, size } = useThree()
  const tiles = useMemo(() => {
    const vp = new THREE.Vector3()
    const dist = camera.position.z
    const vh = 2 * Math.tan(THREE.MathUtils.degToRad((camera as THREE.PerspectiveCamera).fov / 2)) * dist
    const vw = vh * (size.width / size.height)
    void vp
    return buildTiles(vw, vh)
  }, [camera, size])
  const textures = useTexture(PROJECTS.map((p) => img(p)))
  useMemo(() => {
    textures.forEach((t) => {
      t.colorSpace = THREE.SRGBColorSpace
      t.anisotropy = 4
    })
  }, [textures])
  useFrame((_, delta) => {
    // ease the morph toward its target (~1.4s full travel)
    const mo = morph.current
    const dir = Math.sign(mo.target - mo.value)
    if (dir !== 0) {
      mo.value = THREE.MathUtils.clamp(mo.value + dir * Math.min(delta / 1.4, Math.abs(mo.target - mo.value)), 0, 1)
    }
    const e = easeInOut(THREE.MathUtils.clamp(mo.value, 0, 1))
    spin.current += 0.0016 * (1 - e)
    const d = drag.current
    d.oy += d.vy
    d.ox += d.vx
    d.vx *= 0.94
    d.vy *= 0.94
    d.ox = THREE.MathUtils.clamp(d.ox, -0.9, 0.9)
    group.current.rotation.y = (spin.current + d.oy) * (1 - e)
    group.current.rotation.x = d.ox * (1 - e)
  })
  return (
    <group ref={group}>
      {tiles.map((def, i) => (
        <Tile key={def.project.id} def={def} texture={textures[i]} morph={morph} onSelect={onSelect} />
      ))}
    </group>
  )
}

export default function TileSphere({
  drag, morph, onSelect,
}: {
  drag: React.MutableRefObject<DragState>
  morph: React.MutableRefObject<MorphState>
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
        <Cloud drag={drag} morph={morph} onSelect={onSelect} />
      </Suspense>
    </Canvas>
  )
}

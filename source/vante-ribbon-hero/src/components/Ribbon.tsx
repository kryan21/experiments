import { Suspense, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree, type ThreeEvent } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import * as THREE from 'three'
import { TILES, photoUrl, type TileDef } from '../data'
import { evalTimeline, newTLState, showState, type TLState } from '../timeline'

export interface DragState {
  vel: number // added spin velocity from dragging
  sway: number // unused in v2 (kept for the App's pointer handler shape)
}

const TILE_W = 1.95
const TILE_H = 1.44
const RING_R = 3.4
const N = TILES.length
const GRID_N = 6

function graphicTexture(def: Extract<TileDef, { kind: 'graphic' }>): THREE.Texture {
  const c = document.createElement('canvas')
  c.width = 480
  c.height = 355
  const g = c.getContext('2d')!
  g.fillStyle = def.bg
  g.fillRect(0, 0, 480, 355)
  g.fillStyle = def.fg
  g.textAlign = 'center'
  g.font = '92px Anton, Arial, sans-serif'
  g.fillText(def.big, 240, 195, 440)
  g.font = '500 21px Inter, Arial, sans-serif'
  g.globalAlpha = 0.65
  const spaced = def.sub.split('').join('  ')
  g.fillText(spaced, 240, 262, 430)
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 4
  return tex
}

const _obj = new THREE.Object3D()
const IDENTITY = new THREE.Quaternion()

function Flow({
  tl, drag, onSelect,
}: {
  tl: React.MutableRefObject<TLState>
  drag: React.MutableRefObject<DragState>
  onSelect: (index: number) => void
}) {
  const flowTime = useRef(0)
  const rot = useRef(0)
  const prev01 = useRef(0)
  const state = useRef<TLState>(newTLState())
  const gridMix = useRef(0)
  const hoverRef = useRef(-1)
  const { camera, size } = useThree()

  const photoIdx = TILES.map((t, i) => (t.kind === 'photo' ? i : -1)).filter((i) => i >= 0)
  const photoTex = useTexture(photoIdx.map((i) => photoUrl((TILES[i] as { id: number }).id)))
  const textures = useMemo(() => {
    const arr: THREE.Texture[] = new Array(N)
    photoIdx.forEach((tileI, k) => {
      photoTex[k].colorSpace = THREE.SRGBColorSpace
      photoTex[k].anisotropy = 4
      arr[tileI] = photoTex[k]
    })
    TILES.forEach((t, i) => {
      if (t.kind === 'graphic') arr[i] = graphicTexture(t)
    })
    return arr
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [photoTex])

  const layout = useMemo(() => {
    const dist = camera.position.z
    const vh = 2 * Math.tan(THREE.MathUtils.degToRad((camera as THREE.PerspectiveCamera).fov / 2)) * dist
    const vw = vh * (size.width / size.height)
    const portrait = vw < vh
    // scale the whole ring so the front tile keeps its ~1/3-screen presence
    // on any aspect (portrait would otherwise blow it past the frame)
    const fit = THREE.MathUtils.clamp(vw / 10.5, 0.45, 1)
    // grid: 3 cols x 2 rows (2 x 3 on portrait), world-space slots
    const cols = portrait ? 2 : 3
    const rows = portrait ? 3 : 2
    let cellW = vw * (portrait ? 0.46 : 0.3)
    cellW = Math.min(cellW, ((vh * 0.8) / rows) / (TILE_H / TILE_W))
    const cellH = cellW * (TILE_H / TILE_W)
    const gapW = cellW * 1.06
    const gapH = cellH * 1.08
    const gridScale = cellW / TILE_W
    const gridPos = new Map<number, THREE.Vector3>()
    for (let k = 0; k < GRID_N; k++) {
      const col = k % cols
      const row = Math.floor(k / cols)
      gridPos.set(k, new THREE.Vector3(
        (col - (cols - 1) / 2) * gapW,
        ((rows - 1) / 2 - row) * gapH + 0.1,
        0,
      ))
    }
    return { fit, gridPos, gridScale, portrait }
  }, [camera, size])

  const meshes = useRef<(THREE.Mesh | null)[]>([])

  /** Which tiles sit in the grid this loop — alternates halves per loop,
   *  like the reference, whose grid six are not always the same. */
  const gridSet = () => {
    const start = (showState.loops % 2) * GRID_N
    const set = new Map<number, number>() // tileIndex -> slot k
    for (let k = 0; k < GRID_N; k++) set.set(start + k, k)
    return set
  }

  useFrame(({ clock }, delta) => {
    void clock
    if (showState.freezeT != null) {
      flowTime.current = showState.freezeT
      rot.current = -showState.freezeT * 0.55
    } else if (!showState.paused) {
      flowTime.current += Math.min(delta, 0.05)
      const s0 = state.current
      rot.current -= delta * s0.rotSpeed * 0.55
      rot.current += drag.current.vel
    }
    drag.current.vel *= 0.92
    const s = evalTimeline(flowTime.current, state.current)
    tl.current = s
    if (prev01.current > 0.9 && s.time01 < 0.1) showState.loops++
    prev01.current = s.time01

    const e = s.grid * s.grid * (3 - 2 * s.grid)
    gridMix.current = e
    const inGrid = gridSet()
    const gs = s.ringScale * layout.fit
    // as the ring shrinks for the thin-strip phase, fade its back leg so
    // the two legs merge into one low strip instead of a visible oval
    const backVis = THREE.MathUtils.clamp((s.ringScale - 0.36) / 0.28, 0.1, 1)
    const sinT = Math.sin(s.ringTilt)
    const cosT = Math.cos(s.ringTilt)

    for (let i = 0; i < N; i++) {
      const mesh = meshes.current[i]
      if (!mesh) continue
      const ang = rot.current + (i / N) * Math.PI * 2
      const lx = Math.sin(ang) * RING_R
      const lz = Math.cos(ang) * RING_R
      const ly = -lz * sinT * 0.55
      const wx = lx * gs
      const wy = s.ringY + (layout.portrait ? -0.5 : 0) + ly * gs
      const wz = lz * cosT * gs
      // face outward along the radial direction
      _obj.position.set(wx, wy, wz)
      _obj.lookAt(wx + lx, wy + ly * 0.2, wz + lz)
      const slot = inGrid.get(i)
      const mat = mesh.material as THREE.MeshBasicMaterial
      if (slot !== undefined) {
        const gp = layout.gridPos.get(slot)!
        mesh.position.set(
          wx + (gp.x - wx) * e,
          wy + (gp.y - wy) * e,
          wz * (1 - e),
        )
        mesh.quaternion.slerpQuaternions(_obj.quaternion, IDENTITY, e)
        let sc = gs + (layout.gridScale - gs) * e
        if (hoverRef.current === i && e > 0.9) sc *= 1.05
        mesh.scale.setScalar(sc)
        mat.opacity = 1
        mesh.visible = true
      } else {
        mesh.position.set(wx, wy, wz)
        mesh.quaternion.copy(_obj.quaternion)
        mesh.scale.setScalar(gs)
        mat.opacity = (1 - e) * (lz < 0 ? backVis : 1)
        mesh.visible = mat.opacity > 0.02
      }
    }
  })

  const guardGrid = (i: number) => gridMix.current > 0.9 && gridSet().has(i)

  return (
    <group>
      {TILES.map((_t, i) => (
        <mesh
          key={i}
          ref={(m) => { meshes.current[i] = m }}
          onPointerOver={(ev: ThreeEvent<PointerEvent>) => {
            if (guardGrid(i)) {
              ev.stopPropagation()
              hoverRef.current = i
              document.body.style.cursor = 'pointer'
            }
          }}
          onPointerOut={() => {
            if (hoverRef.current === i) {
              hoverRef.current = -1
              document.body.style.cursor = ''
            }
          }}
          onClick={(ev: ThreeEvent<MouseEvent>) => {
            if (guardGrid(i)) {
              ev.stopPropagation()
              onSelect(i)
            }
          }}
        >
          <planeGeometry args={[TILE_W, TILE_H]} />
          <meshBasicMaterial map={textures[i]} transparent toneMapped={false} side={THREE.DoubleSide} />
        </mesh>
      ))}
    </group>
  )
}

export default function Ribbon({
  tl, drag, onSelect,
}: {
  tl: React.MutableRefObject<TLState>
  drag: React.MutableRefObject<DragState>
  onSelect: (index: number) => void
}) {
  return (
    <Canvas
      dpr={[1, 1.8]}
      camera={{ position: [0, 0, 9], fov: 40 }}
      gl={{ antialias: true, alpha: true }}
      style={{ background: 'transparent' }}
    >
      <Suspense fallback={null}>
        <Flow tl={tl} drag={drag} onSelect={onSelect} />
      </Suspense>
    </Canvas>
  )
}

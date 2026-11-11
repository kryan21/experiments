import { Suspense, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import * as THREE from 'three'
import { TILES, photoUrl, type TileDef } from '../data'
import { evalTimeline, newTLState, type TLState } from '../timeline'

export interface DragState {
  vel: number // added flow speed from dragging
  sway: number // -0.5..0.5 pointer height influence on the bend
}

const TILE_W = 1.5
const TILE_H = 0.94
const N = TILES.length

function graphicTexture(def: Extract<TileDef, { kind: 'graphic' }>): THREE.Texture {
  const c = document.createElement('canvas')
  c.width = 480
  c.height = 300
  const g = c.getContext('2d')!
  g.fillStyle = def.bg
  g.fillRect(0, 0, 480, 300)
  g.fillStyle = def.fg
  g.textAlign = 'center'
  g.font = '92px Anton, Arial, sans-serif'
  g.fillText(def.big, 240, 165)
  g.font = '500 21px Inter, Arial, sans-serif'
  g.globalAlpha = 0.65
  const spaced = def.sub.split('').join('  ')
  g.fillText(spaced, 240, 225)
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 4
  return tex
}

/** Point on the ribbon's centreline for parameter u in [0,1].
 *  Arc amplitude scales with span so narrow (portrait) frames keep gentle
 *  slopes instead of near-vertical tiles. */
function curvePoint(
  u: number, bend: number, yOff: number, span: number, out: THREE.Vector3,
) {
  const amp = Math.min(1, span / 9)
  const x = (u - 0.5) * span
  const arc = Math.sin(u * Math.PI) * 1.2 * bend * amp
  const tilt = (u - 0.5) * 0.9 * bend * amp
  const y = yOff + arc + tilt
  // the z-curl must shrink on narrow frames too, or dz/dx explodes and
  // every tile turns edge-on
  const z = -Math.pow(Math.abs(2 * u - 1), 2.2) * (0.5 + bend * 1.5) * Math.min(1, span / 7)
  return out.set(x, y, z)
}

const _p = new THREE.Vector3()
const _p2 = new THREE.Vector3()
const _tan = new THREE.Vector3()
const _xa = new THREE.Vector3()
const _ya = new THREE.Vector3()
const _za = new THREE.Vector3()
const _up = new THREE.Vector3(0, 1, 0)
const _m = new THREE.Matrix4()
const _q = new THREE.Quaternion()
const IDENTITY = new THREE.Quaternion()

function Flow({
  tl, drag,
}: {
  tl: React.MutableRefObject<TLState>
  drag: React.MutableRefObject<DragState>
}) {
  const group = useRef<THREE.Group>(null!)
  const flow = useRef(0)
  const state = useRef<TLState>(newTLState())
  const swaySm = useRef(0)
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
    // portrait: widen the band past the frame edges (ends off-screen) so
    // tile spacing/width matches the desktop ratio instead of stacking
    const span = vw * (portrait ? 1.55 : 1.12)
    // grid: 4 cols x 3 rows, fitted
    const cols = 4
    const rows = 3
    const gap = 0.22
    let cellW = Math.min(2.35, (vw * 0.94) / cols)
    cellW = Math.min(cellW, ((vh * 0.8) / rows) * (TILE_W / TILE_H))
    const cellH = cellW * (TILE_H / TILE_W)
    const gridScale = (cellW - gap * 0.4) / TILE_W
    const totalW = cols * cellW
    const totalH = rows * cellH
    const gridPos = TILES.map((_, i) => {
      const col = i % cols
      const row = Math.floor(i / cols)
      return new THREE.Vector3(
        -totalW / 2 + col * cellW + cellW / 2,
        totalH / 2 - row * cellH - cellH / 2,
        0,
      )
    })
    const fit = THREE.MathUtils.clamp(span / 11.8, 0.42, 1)
    return { span, gridPos, gridScale, fit, portrait }
  }, [camera, size])

  const meshes = useRef<(THREE.Mesh | null)[]>([])

  useFrame(({ clock }, delta) => {
    const s = evalTimeline(clock.getElapsedTime(), state.current)
    tl.current = s
    swaySm.current += (drag.current.sway - swaySm.current) * 0.04
    const bend = s.bend + swaySm.current * 0.35
    flow.current += delta * 0.016 + drag.current.vel
    drag.current.vel *= 0.94

    const e = s.grid * s.grid * (3 - 2 * s.grid)
    for (let i = 0; i < N; i++) {
      const mesh = meshes.current[i]
      if (!mesh) continue
      const u = ((i / N + flow.current) % 1 + 1) % 1
      const yOff = s.yOff + (layout.portrait ? -0.55 : 0)
      curvePoint(u, bend, yOff, layout.span, _p)
      curvePoint(Math.min(1, u + 0.012), bend, yOff, layout.span, _p2)
      // Orient the tile ALONG the path: local X = tangent, face (+Z) toward
      // the viewer (until the band curls away at the ends). A lookAt here
      // would face the tile along the path like a domino — wrong.
      _tan.subVectors(_p2, _p).normalize()
      _za.crossVectors(_tan, _up).normalize()
      if (_za.lengthSq() < 0.001) _za.set(0, 0, 1)
      _ya.crossVectors(_za, _tan).normalize()
      _xa.copy(_tan)
      _m.makeBasis(_xa, _ya, _za)
      _q.setFromRotationMatrix(_m)
      const gp = layout.gridPos[i]
      mesh.position.set(
        _p.x + (gp.x - _p.x) * e,
        _p.y + (gp.y - _p.y) * e,
        _p.z * (1 - e),
      )
      mesh.quaternion.slerpQuaternions(_q, IDENTITY, e)
      const sc = (s.tile + (layout.gridScale - s.tile) * e) * layout.fit
      mesh.scale.setScalar(sc)
      const fade = Math.min(1, Math.min(u, 1 - u) / 0.07)
      const mat = mesh.material as THREE.MeshBasicMaterial
      mat.opacity = 0.25 + 0.75 * Math.max(fade, e)
    }
  })

  return (
    <group ref={group}>
      {TILES.map((_t, i) => (
        <mesh key={i} ref={(m) => { meshes.current[i] = m }}>
          <planeGeometry args={[TILE_W, TILE_H]} />
          <meshBasicMaterial map={textures[i]} transparent toneMapped={false} side={THREE.DoubleSide} />
        </mesh>
      ))}
    </group>
  )
}

export default function Ribbon({
  tl, drag,
}: {
  tl: React.MutableRefObject<TLState>
  drag: React.MutableRefObject<DragState>
}) {
  return (
    <Canvas
      dpr={[1, 1.8]}
      camera={{ position: [0, 0, 9], fov: 40 }}
      gl={{ antialias: true, alpha: true }}
      style={{ background: 'transparent' }}
    >
      <Suspense fallback={null}>
        <Flow tl={tl} drag={drag} />
      </Suspense>
    </Canvas>
  )
}

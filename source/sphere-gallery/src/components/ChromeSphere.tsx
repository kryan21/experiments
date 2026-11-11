import { useEffect, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

/** Builds a tiny studio environment (bright strip lights on black) and PMREMs
 *  it, so the chrome ball picks up those long white streak reflections —
 *  self-contained, no external HDR file needed. */
function StudioEnv() {
  const { gl, scene } = useThree()
  useEffect(() => {
    const pmrem = new THREE.PMREMGenerator(gl)
    const env = new THREE.Scene()
    env.background = new THREE.Color(0x000000)
    const panel = (
      w: number, h: number, pos: [number, number, number],
      lookAt: [number, number, number], brightness: number, rz = 0,
    ) => {
      const m = new THREE.Mesh(
        new THREE.PlaneGeometry(w, h),
        new THREE.MeshBasicMaterial({ side: THREE.DoubleSide }),
      )
      m.material.color.setScalar(brightness)
      m.position.set(...pos)
      m.lookAt(...lookAt)
      if (rz) m.rotateZ(rz)
      env.add(m)
    }
    panel(8, 3, [1.2, 6, 0.5], [0, 0, 0], 15, 0.35) // big soft top light, off-axis
    panel(2.2, 8, [-7, 1, 1], [0, 0, 0], 9, -0.2) // tall left strip
    panel(1.8, 8, [7, 0, -1], [0, 0, 0], 6, 0.25) // right strip
    panel(0.55, 9, [-4, 2, 5], [0, 0, 0], 13, 0.8) // one dramatic diagonal streak
    panel(12, 2.6, [0, 2.5, 9], [0, 0, 0], 0.7) // faint front horizon band
    panel(9, 1.4, [0, -5, 3], [0, 0, 0], 3.2) // low bounce strip
    panel(6, 6, [0, 0, -8], [0, 0, 0], 2.2) // back wash
    const rt = pmrem.fromScene(env, 0.015)
    scene.environment = rt.texture
    return () => {
      scene.environment = null
      rt.texture.dispose()
      pmrem.dispose()
    }
  }, [gl, scene])
  return null
}

function Ball() {
  const group = useRef<THREE.Group>(null!)
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    group.current.position.y = Math.sin(t * 0.7) * 0.07
    group.current.rotation.y = t * 0.12
  })
  return (
    <group ref={group}>
      {/* the ball */}
      <mesh>
        <sphereGeometry args={[1, 64, 64]} />
        <meshPhysicalMaterial
          color={0x131316}
          metalness={1}
          roughness={0.05}
          clearcoat={1}
          clearcoatRoughness={0.1}
          envMapIntensity={2.1}
        />
      </mesh>
      {/* antenna */}
      <mesh position={[0.18, 1.13, 0]}>
        <cylinderGeometry args={[0.012, 0.012, 0.3, 12]} />
        <meshStandardMaterial color={0xcccccc} metalness={1} roughness={0.25} />
      </mesh>
      <mesh position={[0.18, 1.3, 0]}>
        <sphereGeometry args={[0.045, 24, 24]} />
        <meshStandardMaterial
          color={0x7dd3fc}
          emissive={0x38bdf8}
          emissiveIntensity={2.4}
          roughness={0.3}
        />
      </mesh>
      {/* stem + ring stand hugging the base */}
      <mesh position={[0, -1.06, 0]}>
        <cylinderGeometry args={[0.05, 0.07, 0.22, 16]} />
        <meshStandardMaterial color={0xbdbdc2} metalness={1} roughness={0.25} envMapIntensity={1.6} />
      </mesh>
      <mesh position={[0, -1.2, 0]} rotation={[Math.PI / 2.15, 0, 0]}>
        <torusGeometry args={[0.74, 0.026, 16, 96]} />
        <meshStandardMaterial color={0xd8d8dc} metalness={1} roughness={0.16} envMapIntensity={1.8} />
      </mesh>
    </group>
  )
}

export default function ChromeSphere({ className }: { className?: string }) {
  return (
    <Canvas
      className={className}
      dpr={[1, 1.8]}
      camera={{ position: [0, 0.15, 4.4], fov: 38 }}
      gl={{ antialias: true, alpha: true }}
      style={{ background: 'transparent' }}
    >
      <StudioEnv />
      <hemisphereLight args={[0xffffff, 0x111116, 0.5]} />
      <directionalLight position={[3, 4, 5]} intensity={1.2} />
      <Ball />
    </Canvas>
  )
}

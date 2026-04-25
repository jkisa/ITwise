import { useRef, useMemo, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useSection } from '../context/SectionContext'
import { useIsMobile } from '../hooks/useIsMobile'
import {
  heroVertex, heroFragment,
  particleVertex, particleFragment,
  glitchVertex, glitchFragment,
  chromaticVertex, chromaticFragment,
  rippleVertex, rippleFragment,
} from './shaders'

/* ─── HERO: Topographic Mesh ─── */
function HeroEffect({ active, isMobile }: { active: boolean; isMobile: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const matRef = useRef<THREE.ShaderMaterial>(null)
  const mouse = useRef(new THREE.Vector2(0.5, 0.5))

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uMouse: { value: mouse.current },
  }), [])

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current.set(e.clientX / window.innerWidth, 1 - e.clientY / window.innerHeight)
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  useFrame((state) => {
    if (!matRef.current) return
    matRef.current.uniforms.uTime.value = state.clock.elapsedTime
    matRef.current.opacity = THREE.MathUtils.lerp(matRef.current.opacity || 0, active ? 1 : 0, 0.05)
  })

  const seg = isMobile ? 64 : 128
  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]} visible={active || (matRef.current?.opacity || 0) > 0.01}>
      <planeGeometry args={[30, 30, seg, seg]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={heroVertex}
        fragmentShader={heroFragment}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        opacity={0}
      />
    </mesh>
  )
}

/* ─── ABOUT: Neural Particles ─── */
function AboutEffect({ active, isMobile }: { active: boolean; isMobile: boolean }) {
  const pointsRef = useRef<THREE.Points>(null)
  const matRef = useRef<THREE.ShaderMaterial>(null)

  const count = isMobile ? 80 : 350

  const [positions, sizes, randoms] = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const siz = new Float32Array(count)
    const rnd = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const r = 4 + Math.random() * 6
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      pos[i * 3 + 2] = r * Math.cos(phi)
      siz[i] = Math.random()
      rnd[i * 3] = Math.random()
      rnd[i * 3 + 1] = Math.random()
      rnd[i * 3 + 2] = Math.random()
    }
    return [pos, siz, rnd]
  }, [count])

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uScroll: { value: 0 },
  }), [])

  useFrame((state) => {
    if (!matRef.current) return
    matRef.current.uniforms.uTime.value = state.clock.elapsedTime
    matRef.current.opacity = THREE.MathUtils.lerp(matRef.current.opacity || 0, active ? 1 : 0, 0.04)
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.05
    }
  })

  return (
    <points ref={pointsRef} visible={active || (matRef.current?.opacity || 0) > 0.01}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aSize" args={[sizes, 1]} />
        <bufferAttribute attach="attributes-aRandom" args={[randoms, 3]} />
      </bufferGeometry>
      <shaderMaterial
        ref={matRef}
        vertexShader={particleVertex}
        fragmentShader={particleFragment}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        opacity={0}
      />
    </points>
  )
}

/* ─── SERVICES: Glitch Grid ─── */
function ServicesEffect({ active, isMobile }: { active: boolean; isMobile: boolean }) {
  const groupRef = useRef<THREE.Group>(null)
  const matRef = useRef<THREE.ShaderMaterial>(null)
  const mouse = useRef(new THREE.Vector2(0.5, 0.5))

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current.set(e.clientX / window.innerWidth, 1 - e.clientY / window.innerHeight)
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uMouse: { value: mouse.current },
  }), [])

  useFrame((state) => {
    if (!matRef.current) return
    matRef.current.uniforms.uTime.value = state.clock.elapsedTime
    matRef.current.opacity = THREE.MathUtils.lerp(matRef.current.opacity || 0, active ? 0.9 : 0, 0.05)
    if (groupRef.current) {
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.1
      groupRef.current.rotation.y = Math.cos(state.clock.elapsedTime * 0.15) * 0.1
    }
  })

  const range = isMobile ? 2 : 4
  const boxes = useMemo(() => {
    const items: [number, number, number][] = []
    for (let x = -range; x <= range; x++) {
      for (let z = -range; z <= range; z++) {
        items.push([x * 1.2, 0, z * 1.2])
      }
    }
    return items
  }, [range])

  return (
    <group ref={groupRef} visible={active || (matRef.current?.opacity || 0) > 0.01}>
      {boxes.map((pos, i) => (
        <mesh key={i} position={pos}>
          <boxGeometry args={[0.6, 0.6, 0.6, 2, 2, 2]} />
          <shaderMaterial
            ref={i === 0 ? matRef : undefined}
            vertexShader={glitchVertex}
            fragmentShader={glitchFragment}
            uniforms={uniforms}
            transparent
            depthWrite={false}
            opacity={0}
          />
        </mesh>
      ))}
    </group>
  )
}

/* ─── TEAM: Chromatic Glass ─── */
function TeamEffect({ active }: { active: boolean }) {
  const groupRef = useRef<THREE.Group>(null)
  const mats = useRef<THREE.ShaderMaterial[]>([])

  const uniforms = useMemo(() => ({ uTime: { value: 0 } }), [])

  useFrame((state) => {
    mats.current.forEach((mat) => {
      if (!mat) return
      mat.uniforms.uTime.value = state.clock.elapsedTime
      mat.opacity = THREE.MathUtils.lerp(mat.opacity || 0, active ? 0.6 : 0, 0.04)
    })
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.1
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.1
    }
  })

  const spheres = useMemo(() => [
    { pos: [-2.5, 0, 0] as [number, number, number], scale: 1.2 },
    { pos: [2.5, 0.5, -1] as [number, number, number], scale: 0.9 },
    { pos: [0, -1, 1.5] as [number, number, number], scale: 0.7 },
  ], [])

  return (
    <group ref={groupRef} visible={active || (mats.current[0]?.opacity || 0) > 0.01}>
      {spheres.map((s, i) => (
        <mesh key={i} position={s.pos} scale={s.scale}>
          <icosahedronGeometry args={[1.5, 2]} />
          <shaderMaterial
            ref={(el) => { if (el) mats.current[i] = el }}
            vertexShader={chromaticVertex}
            fragmentShader={chromaticFragment}
            uniforms={uniforms}
            transparent
            depthWrite={false}
            side={THREE.DoubleSide}
            opacity={0}
          />
        </mesh>
      ))}
    </group>
  )
}

/* ─── CONTACT: Ripple Plane ─── */
function ContactEffect({ active, isMobile }: { active: boolean; isMobile: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const matRef = useRef<THREE.ShaderMaterial>(null)
  const ripples = useRef<{ x: number; y: number; time: number }[]>([])

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uRipples: { value: Array(6).fill(new THREE.Vector3(0, 0, -100)) },
  }), [])

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const x = e.clientX / window.innerWidth
      const y = 1 - e.clientY / window.innerHeight
      ripples.current.push({ x, y, time: 0 })
      if (ripples.current.length > 6) ripples.current.shift()
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  useFrame((state, delta) => {
    if (!matRef.current) return
    matRef.current.uniforms.uTime.value = state.clock.elapsedTime
    matRef.current.opacity = THREE.MathUtils.lerp(matRef.current.opacity || 0, active ? 1 : 0, 0.05)

    ripples.current.forEach((r) => { r.time += delta })
    ripples.current = ripples.current.filter((r) => r.time < 3)

    const arr = matRef.current.uniforms.uRipples.value as THREE.Vector3[]
    for (let i = 0; i < 6; i++) {
      if (i < ripples.current.length) {
        arr[i].set(ripples.current[i].x, ripples.current[i].y, ripples.current[i].time)
      } else {
        arr[i].set(0, 0, -100)
      }
    }
  })

  const seg = isMobile ? 64 : 128
  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -3, 0]} visible={active || (matRef.current?.opacity || 0) > 0.01}>
      <planeGeometry args={[25, 25, seg, seg]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={rippleVertex}
        fragmentShader={rippleFragment}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        opacity={0}
      />
    </mesh>
  )
}

/* ─── Scene Orchestrator ─── */
function EffectsManager() {
  const { active } = useSection()
  const isMobile = useIsMobile()
  const { camera } = useThree()

  useFrame(() => {
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, 12, 0.02)
  })

  return (
    <>
      <ambientLight intensity={0.5} />
      <HeroEffect active={active === 'hero'} isMobile={isMobile} />
      <AboutEffect active={active === 'about'} isMobile={isMobile} />
      <ServicesEffect active={active === 'services'} isMobile={isMobile} />
      <TeamEffect active={active === 'team'} />
      <ContactEffect active={active === 'contact' || active === 'csr'} isMobile={isMobile} />
    </>
  )
}

export default function ShaderCanvas() {
  const isMobile = useIsMobile()
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
      <Canvas
        camera={{ position: [0, 0, 18], fov: 60 }}
        dpr={isMobile ? [1, 1] : [1, 2]}
        gl={{ alpha: true, antialias: !isMobile, powerPreference: 'high-performance' }}
        style={{ background: 'transparent' }}
      >
        <EffectsManager />
      </Canvas>
    </div>
  )
}
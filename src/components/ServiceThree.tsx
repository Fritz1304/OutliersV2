import { useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { ContactShadows, Environment, Float } from '@react-three/drei'
import type { Group } from 'three'
import HoneyPot from './HoneyPot'
import Bee from './Bee'

function HoneyPotRig() {
  const groupRef = useRef<Group>(null)

  useFrame((state) => {
    if (!groupRef.current) return

    const time = state.clock.elapsedTime
    groupRef.current.position.y = -0.45 + Math.sin(time * 0.9) * 0.06
    groupRef.current.rotation.y = 0.35 + Math.sin(time * 0.5) * 0.24
    groupRef.current.rotation.z = Math.sin(time * 0.8) * 0.03
  })

  return (
    <>
      <group ref={groupRef}>
        <Float speed={1.7} rotationIntensity={0.14} floatIntensity={0.18}>
          <HoneyPot />
        </Float>
        <Bee />
      </group>
      <ContactShadows position={[0, -1.75, 0]} opacity={0.22} scale={6.4} blur={2.1} far={4.2} />
    </>
  )
}

function ServiceCanvas() {
  const camera = useMemo(() => ({ position: [0, 0.2, 7.8] as [number, number, number], fov: 36 }), [])

  return (
    <div className="service-visual relative h-[320px] w-full overflow-hidden rounded-[2rem] border border-black/10 bg-white/55 shadow-[0_18px_80px_rgba(0,0,0,0.08)] backdrop-blur-sm sm:h-[380px] lg:h-[460px] dark:border-black/10 dark:bg-white/45">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(224,77,96,0.18),_transparent_42%),radial-gradient(circle_at_80%_80%,_rgba(0,0,0,0.06),_transparent_36%)]" />
      <Canvas
        camera={camera}
        dpr={[1, 1.5]}
        gl={{ powerPreference: 'high-performance' }}
        className="relative z-10"
      >
        <ambientLight intensity={1.2} />
        <directionalLight position={[5, 8, 5]} intensity={2.2} />
        <spotLight position={[-4, 6, 4]} intensity={1.25} angle={0.45} penumbra={0.8} />
        <Environment preset="city" />
        <HoneyPotRig />
      </Canvas>
    </div>
  )
}

export default function ServiceThree() {
  const service = {
    title: 'BRAND EXPERIENCE',
    slogan: 'Cada marca es una historia',
    description:
      'Llevamos tu marca a nuevas dimensiones con producciones CGI hiperrealistas y simulaciones de vanguardia.',
    bullets: [
      'Modelado y Texturizado de alta calidad.',
      'Simulaciones dinámicas de fluidos y físicas.',
      'Integración con imagen real y VFX.',
    ],
    notes: ['CGI Hyperreal', 'VFX', 'Simulaciones']
  }

  return (
    <section className="bg-page relative mt-20 w-full overflow-hidden px-4 py-20 text-[rgb(240,239,235)] transition-colors duration-300 sm:px-6 md:mt-0 md:px-8 lg:px-10">
      
      {/* Background Orbs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[6%] top-20 h-40 w-40 rounded-full bg-[#fbbc05]/10 blur-3xl dark:bg-[#fbbc05]/15" />
        <div className="absolute bottom-16 right-[8%] h-48 w-48 rounded-full bg-black/6 blur-3xl dark:bg-black/5" />
      </div>

        {/* <p className="absolute right-100 top-0 text-right text-sm text-black/55 dark:text-black/65 bg-[rgb(224,88,108)]">
          {service.slogan}
        </p>
        <p className="inline-block bg-[rgb(240,239,235)] text-black px-4 py-2 rounded-full shadow-sm">
          Mensajito bonito
        </p>
        <p className="inline-block bg-[rgb(240,239,235)] px-6 py-3 shadow rounded-[40%_60%_55%_45%/60%_30%_70%_40%]">
          Mensaje fancy
        </p>
        <p className="relative inline-block px-4 py-2 text-white">
          <span className="absolute inset-0 bg-purple-500 blur-md opacity-50 rounded-full"></span>
          <span className="relative z-10">Mensaje glow</span>
        </p>
        <p className="relative inline-block font-medium">
          <span className="absolute inset-0 bg-yellow-300 -rotate-1 rounded"></span>
          <span className="relative px-1">Texto resaltado</span>
        </p>
        <p className="inline-block px-4 py-2 border-2 border-black rounded-lg bg-white shadow-md">
          Mensaje destacado
        </p>  
        <div className="inline-block bg-[rgb(240,239,235)] px-5 py-2 rounded-xl shadow-lg">
          <p className="text-sm font-medium">
            {service.slogan}
          </p>
        </div>
        <p className="inline-block bg-[rgb(240,239,235)] px-6 py-3 shadow rounded-[40%_60%_55%_45%/60%_30%_70%_40%]">
          Mensaje fancy
        </p> */}
       <div className="absolute top-10 right-10 z-20">
        <div className="relative bg-[rgb(224,88,108)] px-5 py-2 rounded-xl shadow-lg">
          <p className="text-lg italic tracking-wide text-[rgb(240,239,235)]">
            {service.slogan}
          </p>
          <div className="absolute -bottom-2 right-6 w-4 h-4 bg-[rgb(224,88,108)] rotate-45"></div>
        </div>
    </div>

      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(340px,1.1fr)] lg:items-center relative z-20">
        
        <div className="service-copy max-w-2xl">
          <h3 className="max-w-xl text-4xl font-bold uppercase leading-[0.95] tracking-tight sm:text-5xl lg:text-7xl">
            {service.title}
          </h3>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-[rgb(240,239,235)] sm:text-lg">
            {service.description}
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            {service.notes.map((note) => (
              <span
                key={note}
                className="service-note rounded-full border border-black/10 bg-white/55 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-[rgb(240,239,235)] backdrop-blur-sm dark:border-black/10 dark:bg-white/45"
              >
                {note}
              </span>
            ))}
          </div>
          <ul className="mt-8 space-y-4">
            {service.bullets.map((bullet, bulletIndex) => (
              <li
                key={bullet}
                className="flex items-start gap-4 rounded-[1.5rem] border border-black/8 bg-white/45 px-5 py-4 backdrop-blur-sm dark:border-black/8 dark:bg-white/35"
              >
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#fbbc05] text-xs font-bold text-white">
                  3.{bulletIndex + 1}
                </span>
                <span className="text-sm leading-relaxed text-[rgb(240,239,235)] sm:text-base">
                  {bullet}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative">
          <ServiceCanvas />
        </div>
      </div>
    </section>
  )
}

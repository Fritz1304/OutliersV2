//Esta Clase es para creaer la scena completa del drone en movimiento
import { useRef, useState, Suspense } from "react"
import { Canvas } from "@react-three/fiber"
import { Environment, Float, ContactShadows } from "@react-three/drei"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"
import Drone from "../components/Drone"
import * as THREE from "three"

gsap.registerPlugin(ScrollTrigger)

export default function Scene() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [droneGroup, setDroneGroup] = useState<THREE.Group | null>(null)
  const text1Ref = useRef<HTMLDivElement>(null)
  const text2Ref = useRef<HTMLDivElement>(null)

  // ✏️ CAMBIA EL TAMAÑO DEL DRONE AQUÍ (sin romper animaciones)
  const DRONE_SCALE = 0.25

  useGSAP(() => {
    // Wait for refs to be ready
    if (!containerRef.current || !droneGroup || !text1Ref.current || !text2Ref.current) return;

    const container = containerRef.current
    const drone = droneGroup
    const text1 = text1Ref.current
    const text2 = text2Ref.current
    const mm = gsap.matchMedia()

    mm.add(
      {
        isDesktop: "(min-width: 768px)",
        isMobile: "(max-width: 767px)",
      },
      (context) => {
        const { isDesktop } = context.conditions as { isDesktop: boolean }

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: container,
            start: "top top",
            end: "+=300%",
            scrub: 0.6,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            refreshPriority: 1,
          }
        })

        gsap.set(drone.position, {
          x: isDesktop ? -7 : -2.5,
          y: isDesktop ? -1 : -0.75,
          z: 2,
        })
        gsap.set(drone.rotation, { x: 0.2, y: Math.PI / 4, z: -0.1 })
        gsap.set(text1, { opacity: 1, x: 0, y: 0 })
        gsap.set(
          text2,
          isDesktop ? { opacity: 0, x: -50 } : { opacity: 0, y: 28 }
        )

        tl.to(drone.position, { x: isDesktop ? -2 : -0.7, duration: 1 })
          .to(drone.rotation, { y: Math.PI / 6, z: 0, duration: 1 }, "<")
          .to({}, { duration: 0.5 })
          .to(
            text1,
            isDesktop
              ? { opacity: 0, x: 50, duration: 1 }
              : { opacity: 0, y: -28, duration: 1 }
          )
          .to(drone.position, { x: isDesktop ? 2 : 0.95, duration: 1.5 }, "<")
          .to(drone.rotation, { y: Math.PI / 6 + Math.PI, z: 0.1, duration: 1.5 }, "<")
          .fromTo(
            text2,
            isDesktop ? { opacity: 0, x: -50 } : { opacity: 0, y: 28 },
            isDesktop ? { opacity: 1, x: 0, duration: 1 } : { opacity: 1, y: 0, duration: 1 },
            "-=0.5"
          )
      }
    )

    return () => {
      mm.revert()
    }
  }, { scope: containerRef, dependencies: [droneGroup] })

  return (
    <section ref={containerRef} className="bg-page relative flex h-screen w-full items-center overflow-hidden transition-colors duration-300">

      {/* 3D Canvas Context */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        <Canvas
          camera={{ position: [0, 0, 8], fov: 45 }}
          dpr={[1, 1.5]}
          gl={{ powerPreference: "high-performance" }}
        >
          <ambientLight intensity={1.2} />
          <directionalLight position={[5, 10, 5]} intensity={2.5} castShadow />
          <Environment preset="city" />

          {/* Group wrapper to animate Drone with GSAP */}
          <group ref={setDroneGroup}>
            <Float
              speed={2} // Animation speed
              rotationIntensity={0.5} // xyz rotation intensity
              floatIntensity={0.8} // Up/down float intensity
            >
              <Suspense fallback={null}>
                <Drone scale={DRONE_SCALE} />
              </Suspense>
            </Float>
            {/* Optional Shadow */}
            <ContactShadows position={[0, -1.5, 0]} opacity={0.32} scale={9} blur={1.6} far={3.6} />
          </group>

        </Canvas>
      </div>

      {/* HTML DOM Content overlay */}
      <div className="relative z-20 mx-auto grid h-full w-full max-w-7xl grid-cols-1 px-4 sm:px-6 md:grid-cols-2 md:px-6 pointer-events-none">
        
        {/* Left Side (Text 2 will appear here) */}
        <div className="flex h-full flex-col justify-start pt-24 md:justify-center md:pt-0">
          <div ref={text2Ref} className="max-w-xs space-y-4 text-black dark:text-black sm:max-w-md md:max-w-lg md:space-y-6">
            <h2 className="text-3xl font-bold uppercase leading-tight tracking-tight sm:text-4xl md:text-7xl">
              Tomas<br />Inmersivas
            </h2>
            <p className="text-base font-light text-gray-600 dark:text-black/70 sm:text-lg md:text-xl">
              Llevamos tu contenido al siguiente nivel. Cobertura total en interiores y exteriores con drones FPV de alta velocidad que logran ángulos que parecen imposibles.
            </p>
          </div>
        </div>

        {/* Right Side (Text 1 will appear here) */}
        <div className="flex h-full flex-col items-start justify-end pb-16 md:items-end md:justify-center md:pb-0">
          <div ref={text1Ref} className="max-w-xs space-y-4 text-left text-black dark:text-black sm:max-w-md md:max-w-lg md:space-y-6 md:text-right">
            <h2 className="text-3xl font-bold uppercase leading-tight tracking-tight sm:text-4xl md:text-7xl">
              Planos<br />Aéreos
            </h2>
            <p className="text-base font-light text-gray-600 dark:text-black/70 sm:text-lg md:text-xl">
              Capturamos la acción desde el cielo. Nuestro servicio especializado de drones graba la esencia de cada movimiento, logrando perspectivas dinámicas para marcas que exigen máxima calidad.
            </p>
          </div>
        </div>

      </div>
    </section>
  )
}

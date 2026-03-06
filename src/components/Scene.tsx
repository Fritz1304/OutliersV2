import { useRef } from "react"
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
  const droneGroupRef = useRef<THREE.Group>(null)
  const text1Ref = useRef<HTMLDivElement>(null)
  const text2Ref = useRef<HTMLDivElement>(null)

  // ✏️ CAMBIA EL TAMAÑO DEL DRONE AQUÍ (sin romper animaciones)
  const DRONE_SCALE = 0.25

  useGSAP(() => {
    // Wait for refs to be ready
    if (!containerRef.current || !droneGroupRef.current || !text1Ref.current || !text2Ref.current) return;

    const container = containerRef.current;
    const drone = droneGroupRef.current;
    const text1 = text1Ref.current;
    const text2 = text2Ref.current;

    // Create a GSAP timeline synced with standard scroll
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: "top top",
        end: "+=300%", // 3 times window height of scrolling
        scrub: 1, // Smooth scrolling effect
        pin: true, // Pin the section while scrolling
      }
    });

    // Initial States (Set basic hiding, GSAP handles the rest)
    gsap.set(drone.position, { x: -6, y: -1, z: 2 })
    gsap.set(drone.rotation, { x: 0.2, y: Math.PI / 4, z: -0.1 })
    
    // Esconder textos al inicio para evitar parpadeos
    gsap.set(text1, { opacity: 0 })
    gsap.set(text2, { opacity: 0 })

    // Frame 1: Drone moves in, Text 1 slides IN from right to center
    tl.to(drone.position, { x: -2, duration: 1 })
      .to(drone.rotation, { y: Math.PI / 6, z: 0, duration: 1 }, "<")
      .fromTo(text1, 
        { opacity: 0, x: 50 }, 
        { opacity: 1, x: 0, duration: 1 }, 
        "<"
      ) 

    // Frame 2: Hold a bit
    tl.to({}, { duration: 0.5 }) 

    // Frame 3: Text 1 slides OUT, Drone spins 360° horizontally while moving right
    tl.to(text1, { opacity: 0, x: 50, duration: 1 }) 
      .to(drone.position, { x: 2, duration: 1.5 }, "<")
      .to(drone.rotation, { y: Math.PI / 6 + Math.PI, z: 0.1, duration: 1.5 }, "<") // Half horizontal spin

    // Frame 4: Text 2 slides IN from left to center
    tl.fromTo(text2, 
      { opacity: 0, x: -50 }, 
      { opacity: 1, x: 0, duration: 1 }, 
      "-=0.5"
    )

  }, { scope: containerRef })

  return (
    <section ref={containerRef} className="relative w-full h-screen bg-white dark:bg-black overflow-hidden flex items-center transition-colors duration-300">

      {/* 3D Canvas Context */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
          <ambientLight intensity={1.2} />
          <directionalLight position={[5, 10, 5]} intensity={2.5} castShadow />
          <Environment preset="city" />

          {/* Group wrapper to animate Drone with GSAP */}
          <group ref={droneGroupRef}>
            <Float
              speed={2} // Animation speed
              rotationIntensity={0.5} // xyz rotation intensity
              floatIntensity={0.8} // Up/down float intensity
            >
              <Drone scale={DRONE_SCALE} />
            </Float>
            {/* Optional Shadow */}
            <ContactShadows position={[0, -1.5, 0]} opacity={0.4} scale={10} blur={2} far={4} />
          </group>

        </Canvas>
      </div>

      {/* HTML DOM Content overlay */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 pointer-events-none h-full">
        
        {/* Left Side (Text 2 will appear here) */}
        <div className="flex flex-col justify-center h-full">
          <div ref={text2Ref} className="text-black dark:text-white space-y-6 max-w-lg">
            <h2 className="text-5xl md:text-7xl font-bold uppercase tracking-tight leading-tight">
              Tomas<br />Inmersivas
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 font-light">
              Llevamos tu contenido al siguiente nivel. Cobertura total en interiores y exteriores con drones FPV de alta velocidad que logran ángulos que parecen imposibles.
            </p>
          </div>
        </div>

        {/* Right Side (Text 1 will appear here) */}
        <div className="flex flex-col justify-center items-end h-full">
          <div ref={text1Ref} className="text-black dark:text-white space-y-6 max-w-lg text-right">
            <h2 className="text-5xl md:text-7xl font-bold uppercase tracking-tight leading-tight">
              Planos<br />Aéreos
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 font-light">
              Capturamos la acción desde el cielo. Nuestro servicio especializado de drones graba la esencia de cada movimiento, logrando perspectivas dinámicas para marcas que exigen máxima calidad.
            </p>
          </div>
        </div>

      </div>
    </section>
  )
}
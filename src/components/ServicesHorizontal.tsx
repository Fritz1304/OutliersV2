import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { ContactShadows, Environment, Float } from '@react-three/drei'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type { Group } from 'three'
import Drone from './Drone'
import HoneyPot from './HoneyPot'
import Bee from './Bee'

gsap.registerPlugin(ScrollTrigger, useGSAP)

const SERVICES = [
  {
    title: 'Brand Core',
    slogan: 'BE AN OUTLIER',
    description:
      'Nucleo de la marca',
    bullets: [
      'Naming, concepto y narrativa de marca.',
      'Identidad visual, piezas clave y lineamientos.'
    ],
    notes: ['Brief creativo', 'Sistema visual', 'Lanzamiento'],
    visual: 'cards',
    cards: [
      {
        title: 'Identidad',
        body: 'Diseñamos marcas con personalidad clara, criterios visuales y una narrativa lista para sostenerse en el tiempo.',
      },
      {
        title: 'Contenido',
        body: 'Traducimos ideas en piezas para redes, campanas y puntos de contacto que si se sienten pensados para tu marca.',
      },
      {
        title: 'Direccion',
        body: 'Alineamos tono, arte y ejecucion para que cada entrega mantenga coherencia y proposito.',
      },
      {
        title: 'Lanzamiento',
        body: 'Preparamos el sistema visual para salir al mercado con materiales utiles desde el dia uno.',
      },
    ],
  },
  {
    title: 'Brand Visual',
    slogan: 'Concepto, tinta y acción',
    description:
      'Identidad Visual',
    bullets: [
      'Naming, concepto y narrativa de marca.',
      'Identidad visual, piezas clave y lineamientos.',
      'Campanas, redes y contenido con direccion estrategica.',
    ],
    notes: ['Brief creativo', 'Sistema visual', 'Lanzamiento'],
    visual: 'cards',
    cards: [
      {
        title: 'Ejemplo 1',
        body: 'Esta es una tarjeta independiente para el Servicio 02. Lista para ser modificada.',
      },
      {
        title: 'Ejemplo 2',
        body: 'Cada servicio ahora tiene sus propias tarjetas configurables desde el código.',
      },
    ],
  }
] as const

type ServiceVisual = 'cards' | 'drone' | 'honeypot'

const hiddenRevealStyle = {
  opacity: 0,
  transform: 'translate3d(0, 28px, 0)',
} as const

const hiddenVisualStyle = {
  opacity: 0,
  transform: 'translate3d(0, 24px, 0) scale(0.94)',
} as const

const hiddenNoteStyle = {
  opacity: 0,
  transform: 'translate3d(0, 18px, 0)',
} as const

const hiddenSloganStyle = {
  opacity: 0,
  transform: 'translate3d(0, 15px, 0)',
} as const

function DroneRig() {
  const groupRef = useRef<Group>(null)

  useFrame((state) => {
    if (!groupRef.current) return

    const time = state.clock.elapsedTime
    groupRef.current.position.y = -0.15 + Math.sin(time * 1.2) * 0.12
    groupRef.current.rotation.x = 0.16 + Math.sin(time * 0.7) * 0.03
    groupRef.current.rotation.y = 0.45 + Math.sin(time * 0.45) * 0.32
    groupRef.current.rotation.z = Math.sin(time * 0.85) * 0.05
  })

  return (
    <>
      <group ref={groupRef} position={[0, -0.1, 0]}>
        <Float speed={2.2} rotationIntensity={0.25} floatIntensity={0.55}>
          <Drone scale={0.22} />
        </Float>
      </group>
      <ContactShadows position={[0, -1.7, 0]} opacity={0.28} scale={7.5} blur={1.8} far={4} />
    </>
  )
}

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

function ServiceCanvas({
  visual,
  style,
}: {
  visual: Exclude<ServiceVisual, 'cards'>
  style?: CSSProperties
}) {
  const camera = useMemo(
    () =>
      visual === 'drone'
        ? { position: [0, 0, 7.5] as [number, number, number], fov: 38 }
        : { position: [0, 0.2, 7.8] as [number, number, number], fov: 36 },
    [visual]
  )

  return (
    <div
      className="service-visual relative h-[320px] w-full overflow-hidden rounded-[2rem] border border-black/10 bg-white/55 shadow-[0_18px_80px_rgba(0,0,0,0.08)] backdrop-blur-sm sm:h-[380px] lg:h-[460px] dark:border-black/10 dark:bg-white/45"
      style={style}
    >
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
        {visual === 'drone' ? <DroneRig /> : <HoneyPotRig />}
      </Canvas>
    </div>
  )
}

type CardProps = { title: string; body: string }

function ServiceCards({
  cards,
  style,
}: {
  cards: readonly CardProps[]
  style?: CSSProperties
}) {
  return (
    <div className="service-visual grid gap-4 sm:grid-cols-2" style={style}>
      {cards.map((card) => (
        <article
          key={card.title}
          className="rounded-[1.75rem] border border-black/10 bg-white/60 p-6 shadow-[0_18px_70px_rgba(0,0,0,0.07)] backdrop-blur-sm transition-transform duration-300 hover:-translate-y-1 dark:border-black/10 dark:bg-white/45"
        >
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-[rgb(224,77,96)]">
            {card.title}
          </p>
          <p className="text-sm leading-relaxed text-[rgb(240,239,235)] sm:text-base">
            {card.body}
          </p>
        </article>
      ))}
    </div>
  )
}

export default function ServicesHorizontal() {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth < 1024 : false
  )

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 1023px)')
    const sync = () => setIsMobile(mediaQuery.matches)

    sync()
    mediaQuery.addEventListener('change', sync)

    return () => {
      mediaQuery.removeEventListener('change', sync)
    }
  }, [])

  useGSAP(
    () => {
      const container = containerRef.current
      const wrapper = wrapperRef.current
      const track = trackRef.current
      if (!container || !wrapper || !track) return

      const panels = gsap.utils.toArray<HTMLElement>('.service-panel', container)
      const slogans = gsap.utils.toArray<HTMLElement>('.service-slogan', container)

      const horizontalTween = gsap.to(track, {
        x: () => -(track.scrollWidth - window.innerWidth),
        ease: 'none',
        scrollTrigger: {
          trigger: wrapper,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1,
          invalidateOnRefresh: true,
          refreshPriority: 2,
        },
      })

      panels.forEach((panel, index) => {
        const copy = panel.querySelector('.service-copy')
        const visual = panel.querySelector('.service-visual')
        const notes = panel.querySelectorAll('.service-note')
        const revealTargets = [copy, visual, ...Array.from(notes)].filter(Boolean)

        if (index === 0) {
          gsap.set(revealTargets, {
            autoAlpha: 1,
            x: 0,
            y: 0,
            scale: 1,
          })
        }

        if (copy && index > 0) {
          gsap.fromTo(
            copy,
            { autoAlpha: 0, x: 32, y: 0 },
            {
              autoAlpha: 1,
              x: 0,
              duration: 0.7,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: panel,
                containerAnimation: horizontalTween,
                start: 'left center',
                end: 'center center',
                scrub: 0.5,
              },
            }
          )
        }

        if (visual && index > 0) {
          gsap.fromTo(
            visual,
            { autoAlpha: 0, scale: 0.94, y: 24 },
            {
              autoAlpha: 1,
              scale: 1,
              y: 0,
              duration: 0.8,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: panel,
                containerAnimation: horizontalTween,
                start: 'left 58%',
                end: 'center center',
                scrub: 0.55,
              },
            }
          )
        }

        if (notes.length && index > 0) {
          gsap.fromTo(
            notes,
            { autoAlpha: 0, y: 18 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.45,
              stagger: 0.08,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: panel,
                containerAnimation: horizontalTween,
                start: 'left 62%',
                end: 'center center',
                scrub: false,
              },
            }
          )
        }

        // Animate the dynamically changing slogan in the top right header!
        if (slogans.length > 0 && index > 0) {
          // Fade out the previous slogan
          gsap.to(slogans[index - 1], {
            autoAlpha: 0,
            y: -15,
            scrollTrigger: {
              trigger: panel,
              containerAnimation: horizontalTween,
              start: 'left 65%',
              end: 'left 35%',
              scrub: 1,
            }
          })
          
          // Fade in the new slogan
          gsap.fromTo(slogans[index],
            { autoAlpha: 0, y: 15 },
            {
              autoAlpha: 1,
              y: 0,
              scrollTrigger: {
                trigger: panel,
                containerAnimation: horizontalTween,
                start: 'left 65%',
                end: 'left 35%',
                scrub: 1,
              }
            }
          )
        }
      })
    },
    { scope: containerRef, dependencies: [isMobile], revertOnUpdate: true }
  )

  return (
    <div
      ref={wrapperRef}
      className="relative w-full"
      style={{ minHeight: `calc(100vh + ${(SERVICES.length - 1) * 100}vw)` }}
    >
      <section
        id="services"
        ref={containerRef}
        className="bg-page sticky top-0 relative h-screen w-full overflow-hidden text-[rgb(240,239,235)] transition-colors duration-300"
      >
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-[6%] top-20 h-40 w-40 rounded-full bg-[rgb(224,77,96)]/10 blur-3xl" />
          <div className="absolute bottom-16 right-[8%] h-48 w-48 rounded-full bg-black/6 blur-3xl dark:bg-black/5" />
        </div>

        <div className="pointer-events-none absolute left-0 right-0 top-0 z-20 mx-auto flex w-full max-w-7xl items-start justify-between px-4 pt-20 sm:px-6 md:px-8 lg:px-10">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.34em] text-[rgb(224,77,96)]">
              Servicios
            </p>
          </div>
          <div className="hidden relative flex-1 max-w-sm lg:block h-16">
            {SERVICES.map((service, index) => (
              <p 
                key={service.title} 
                className="service-slogan absolute right-0 top-0 w-full text-right text-sm leading-relaxed text-[rgb(240,239,235)]"
                style={index === 0 ? undefined : hiddenSloganStyle}
              >
                {service.slogan}
              </p>
            ))}
          </div>
        </div>

        <div
          ref={trackRef}
          className="relative flex h-full will-change-transform"
          style={{ width: `${SERVICES.length * 100}vw` }}
        >
          {SERVICES.map((service, index) => (
            <article
              key={service.title}
              className="service-panel relative flex h-full w-screen shrink-0 items-center px-4 pb-10 pt-28 sm:px-6 md:px-8 md:pt-32 lg:px-10"
            >
              <div className="mx-auto grid w-full max-w-7xl gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(340px,1.1fr)] lg:items-center">
                <div
                  className="service-copy max-w-2xl"
                  style={index === 0 ? undefined : hiddenRevealStyle}
                >
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
                        style={index === 0 ? undefined : hiddenNoteStyle}
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
                        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[rgb(224,77,96)] text-xs font-bold text-white">
                          {index + 1}.{bulletIndex + 1}
                        </span>
                        <span className="text-sm leading-relaxed text-[rgb(240,239,235)] sm:text-base">
                          {bullet}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="relative">
                  {service.visual === 'cards' ? (
                    <ServiceCards
                      cards={'cards' in service && service.cards ? service.cards : []}
                      style={index === 0 ? undefined : hiddenVisualStyle}
                    />
                  ) : (
                    <ServiceCanvas
                      visual={service.visual as Exclude<ServiceVisual, 'cards'>}
                      style={index === 0 ? undefined : hiddenVisualStyle}
                    />
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}

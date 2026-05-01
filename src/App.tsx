import { startTransition, useCallback, useEffect, useState } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './App.css'
import Navbar from './components/Navbar'
import IntroLoader from './components/IntroLoader'
import AboutUs from './components/AboutUs'
import ContactUs from './components/ContactUs'
import SmoothScroll from './hooks/SmoothScroll'
import ServicesHorizontal from './components/ServicesHorizontal'
import Scene from './components/Scene'
import ServiceThree from './components/ServiceThree'
import PortFolio from './components/PortFolio'

function SectionFallback({
  className = '',
  title = 'Cargando experiencia',
  copy = 'Estamos preparando los recursos visuales de esta seccion.',
}: {
  className?: string
  title?: string
  copy?: string
}) {
  return (
    <div
      className={`bg-page relative flex w-full items-center overflow-hidden transition-colors duration-300 ${className}`}
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[12%] top-20 h-28 w-28 rounded-full bg-[rgb(224,77,96)]/10 blur-3xl dark:bg-[rgb(224,77,96)]/12" />
        <div className="absolute bottom-16 right-[10%] h-32 w-32 rounded-full bg-black/6 blur-3xl dark:bg-white/6" />
      </div>

      <div className="relative mx-auto flex max-w-3xl flex-col items-start gap-4 px-6 sm:px-8 md:px-12">
        <div className="h-1.5 w-28 overflow-hidden rounded-full bg-black/10 dark:bg-white/10">
          <div className="h-full w-1/2 animate-pulse rounded-full bg-[rgb(224,77,96)]" />
        </div>
        <p className="text-xs font-semibold uppercase tracking-[0.34em] text-[rgb(240,239,235)]">
          Servicios
        </p>
        <h2 className="max-w-2xl text-3xl font-semibold tracking-tight text-[rgb(240,239,235)] sm:text-4xl md:text-5xl">
          {title}
        </h2>
        <p className="max-w-xl text-base leading-relaxed text-[rgb(240,239,235)] sm:text-lg">
          {copy}
        </p>
      </div>
    </div>
  )
}

function DeferredSectionsFallback() {
  return (
    <div className="w-full">
      <SectionFallback
        className="h-screen"
        title="Cargando servicios"
        copy="Estamos preparando el recorrido horizontal y las escenas 3D para que entren completas."
      />
      <SectionFallback
        className="h-screen"
        title="Cargando tomas inmersivas"
        copy="Estamos dejando lista la escena aérea para que entre con el espacio correcto desde el inicio."
      />
      <SectionFallback
        className="min-h-screen py-20"
        title="Cargando brand experience"
        copy="Reservamos la sección editorial mientras terminan de hidratarse los recursos visuales."
      />
      <SectionFallback
        className="h-screen"
        title="Cargando portafolio"
        copy="Estamos montando la siguiente sección sin mover el contenido ya visible."
      />
      <SectionFallback
        className="min-h-[72rem] py-12"
        title="Cargando contacto"
        copy="El formulario y sus tarjetas ya tienen espacio reservado para evitar saltos cuando aparezcan."
      />
    </div>
  )
}

function App() {
  const [introReady, setIntroReady] = useState(false)
  const [heavyModulesReady, setHeavyModulesReady] = useState(false)
  const handleIntroReady = useCallback(() => {
    setIntroReady(true)
  }, [])

  const heavySectionsReady = introReady && heavyModulesReady

  useEffect(() => {
    if (!introReady) return

    let cancelled = false
    let firstFrame = 0
    let secondFrame = 0

    const preloadHeavySections = async () => {
      await import('./components/ServiceModelsPreloader')

      if (cancelled) return

      startTransition(() => {
        setHeavyModulesReady(true)
      })
    }

    firstFrame = window.requestAnimationFrame(() => {
      secondFrame = window.requestAnimationFrame(() => {
        if (cancelled) return
        void preloadHeavySections()
      })
    })

    return () => {
      cancelled = true
      window.cancelAnimationFrame(firstFrame)
      window.cancelAnimationFrame(secondFrame)
    }
  }, [introReady])

  useEffect(() => {
    if (!heavySectionsReady) return

    const refreshFrame = window.requestAnimationFrame(() => {
      ScrollTrigger.refresh()
    })

    return () => {
      window.cancelAnimationFrame(refreshFrame)
    }
  }, [heavySectionsReady])

  return (
    <div className="bg-page min-h-screen w-full text-[rgb(240,239,235)]">
      {introReady ? <SmoothScroll /> : null}
      <Navbar />
      <IntroLoader onIntroReady={handleIntroReady} />
      <AboutUs />
      {heavySectionsReady ? (
        <>
          <ServicesHorizontal />
          <Scene />
          <ServiceThree />
          <PortFolio />
          <ContactUs />
        </>
      ) : introReady ? (
        <DeferredSectionsFallback />
      ) : null}
    </div>
  )
}

export default App

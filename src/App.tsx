import { Suspense, lazy, startTransition, useCallback, useEffect, useState } from 'react'
import { useGLTF } from '@react-three/drei'
import './App.css'
import Navbar from './components/Navbar'
import IntroLoader from './components/IntroLoader'
import AboutUs from './components/AboutUs'
import ContactUs from './components/ContactUs'
import SmoothScroll from './hooks/SmoothScroll'

const DRONE_MODEL_PATH = `${import.meta.env.BASE_URL}models/drone.glb`
const PENCIL_MODEL_PATH = `${import.meta.env.BASE_URL}models/apple_pencil.glb`
const ParticlesHorizontalScroll = lazy(() => import('./components/ParticlesHorizontalScroll'))
const Scene = lazy(() => import('./components/Scene'))

function SectionFallback({ className = '' }: { className?: string }) {
  return (
    <div className={`w-full bg-white transition-colors duration-300 dark:bg-neutral-950 ${className}`} />
  )
}

function App() {
  const [introReady, setIntroReady] = useState(false)
  const [heavySectionsReady, setHeavySectionsReady] = useState(false)
  const handleIntroReady = useCallback(() => {
    setIntroReady(true)
  }, [])

  useEffect(() => {
    let cancelled = false
    let firstFrame = 0
    let secondFrame = 0

    const preloadHeavySections = async () => {
      useGLTF.preload(DRONE_MODEL_PATH)
      useGLTF.preload(PENCIL_MODEL_PATH)

      await Promise.all([
        import('./components/ParticlesHorizontalScroll'),
        import('./components/Scene'),
      ])

      if (cancelled) return

      startTransition(() => {
        setHeavySectionsReady(true)
      })
    }

    firstFrame = window.requestAnimationFrame(() => {
      secondFrame = window.requestAnimationFrame(() => {
        void preloadHeavySections()
      })
    })

    return () => {
      cancelled = true
      window.cancelAnimationFrame(firstFrame)
      window.cancelAnimationFrame(secondFrame)
    }
  }, [])

  return (
    <div className="min-h-screen w-full bg-white text-black dark:bg-neutral-950 dark:text-white">
      {introReady ? <SmoothScroll /> : null}
      <Navbar />
      <IntroLoader onIntroReady={handleIntroReady} />
      <AboutUs />
      <Suspense fallback={<SectionFallback className="h-screen" />}>
        {introReady && heavySectionsReady ? <ParticlesHorizontalScroll /> : <SectionFallback className="h-screen" />}
      </Suspense>
      <Suspense fallback={<SectionFallback className="h-screen" />}>
        {introReady && heavySectionsReady ? <Scene /> : <SectionFallback className="h-screen" />}
      </Suspense>
      <ContactUs />
    </div>
  )
}

export default App

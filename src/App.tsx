import { useCallback, useState } from 'react'
// import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './App.css'
import Navbar from './components/Navbar'
import IntroLoader from './components/IntroLoader'
// import AboutUs from './components/AboutUs'
import ContactUs from './components/ContactUs'
import SmoothScroll from './hooks/SmoothScroll'
import ServicesHorizontal from './components/ServicesHorizontal'
import Scene from './components/Scene'
import ServiceThree from './components/ServiceThree'
import PortFolio from './components/PortFolio'
import Outliers from './components/Outliers'

function App() {
  const [introReady, setIntroReady] = useState(false)

  const handleIntroReady = useCallback(() => {
    setIntroReady(true)
  }, [])

  return (
    <div className="bg-page min-h-screen w-full text-[rgb(240,239,235)]">
      {introReady ? <SmoothScroll /> : null}
      <Navbar />
      <IntroLoader onIntroReady={handleIntroReady} />
      <main
        className={`relative z-10 transition-opacity duration-500 ${
          introReady ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        aria-hidden={!introReady}
      >
          <Outliers />
          <ServicesHorizontal />
          <Scene />
          <ServiceThree />
          <PortFolio />
          <ContactUs />
      </main>
    </div>
  )
}

export default App

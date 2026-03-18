import './App.css'
import Navbar from './components/Navbar'
import IntroLoader from './components/IntroLoader'
import AboutUs from './components/AboutUs'
import ContactUs from './components/ContactUs'
import Scene from './components/Scene'
import ParticlesHorizontalScroll from './components/ParticlesHorizontalScroll'

function App() {
  return (
    <div className="min-h-screen w-full bg-white text-black dark:bg-neutral-950 dark:text-white">
      <Navbar />
      <IntroLoader />
      <AboutUs />
      <ParticlesHorizontalScroll/>
      <Scene />
      <ContactUs />
    </div>
  )
}

export default App

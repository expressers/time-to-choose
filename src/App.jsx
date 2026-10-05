import { useCallback, useLayoutEffect, useState } from 'react'
import { LangProvider } from './lang.jsx'
import { gsap, ScrollTrigger, reduced, startLenis } from './motion.js'
import Intro from './components/Intro.jsx'
import Nav from './components/Nav.jsx'
import Hero from './components/Hero.jsx'
import Arrival from './components/Arrival.jsx'
import Services from './components/Services.jsx'
import Fleet from './components/Fleet.jsx'
import Stays from './components/Stays.jsx'
import Angola from './components/Angola.jsx'
import Plan from './components/Plan.jsx'
import Footer from './components/Footer.jsx'

function useReveals() {
  useLayoutEffect(() => {
    if (reduced()) {
      document.documentElement.classList.add('rm')
      return
    }
    startLenis()
    const ctx = gsap.context(() => {
      ScrollTrigger.batch('.rv', {
        start: 'top 88%',
        once: true,
        onEnter: (els) =>
          gsap.to(els, { opacity: 1, y: 0, duration: 1.2, ease: 'expo.out', stagger: 0.08, overwrite: true }),
      })
    })
    const onLoad = () => ScrollTrigger.refresh()
    window.addEventListener('load', onLoad)
    return () => {
      ctx.revert()
      window.removeEventListener('load', onLoad)
    }
  }, [])
}

function Page() {
  const [ready, setReady] = useState(false)
  const [service, setService] = useState(null)
  const onDone = useCallback(() => setReady(true), [])
  useReveals()
  return (
    <>
      <Intro onDone={onDone} />
      <Nav />
      <main>
        <Hero ready={ready} />
        <Arrival />
        <Services onPick={setService} />
        <Fleet />
        <Stays onPick={setService} />
        <Angola />
        <Plan service={service} />
      </main>
      <Footer />
    </>
  )
}

export default function App() {
  return (
    <LangProvider>
      <Page />
    </LangProvider>
  )
}

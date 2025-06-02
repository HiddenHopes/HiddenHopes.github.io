// src/App.tsx
import React, { useState } from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import GameComponent from './components/GameComponent'
import MainBody from './components/MainBody'
import AboutPage from './components/AboutPage'
import ContactPage from './components/ContactPage'
import CoursesPage from './components/CoursesPage'
import CircularHeader from './components/CircularHeader'

function App() {
  const [isNight, setIsNight] = useState(true)
  const [showGameMenu, setShowGameMenu] = useState(false)
  const [showTicTacToe, setShowTicTacToe] = useState(false)
  const [showDrawing, setShowDrawing] = useState(false)
  const [showFootball, setShowFootball] = useState(false)
  const [showAbout, setShowAbout] = useState(false)
  const [showContact, setShowContact] = useState(false)
  const [showCourses, setShowCourses] = useState(false)
  const handleThemeToggle = () => setIsNight((prev) => !prev)
  const handleGameMenuToggle = () => setShowGameMenu((prev) => !prev)
  const handleShowAbout = () => {
    setShowAbout(true)
    setShowContact(false)
    setShowCourses(false)
  }
  const handleShowContact = () => {
    setShowContact(true)
    setShowAbout(false)
    setShowCourses(false)
  }
  const handleShowCourses = () => {
    setShowCourses(true)
    setShowAbout(false)
    setShowContact(false)
  }

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        position: 'relative',
        overflow: 'hidden',
        background: isNight
          ? 'radial-gradient(ellipse at 50% 80%,rgb(24, 55, 133) 0%, #090a0f 100%)'
          : 'linear-gradient(to bottom, #e3f6ff 0%, #b3e0ff 100%)'
      }}
    >
      <CircularHeader
        isNight={isNight}
        onThemeToggle={handleThemeToggle}
        onAboutClick={handleShowAbout}
        onContactClick={handleShowContact}
        onCoursesClick={handleShowCourses}
      />
      {/* Show overlay pages if active */}
      {showAbout && (
        <AboutPage isNight={isNight} onClose={() => setShowAbout(false)} />
      )}
      {showContact && (
        <ContactPage isNight={isNight} onClose={() => setShowContact(false)} />
      )}
      {showCourses && (
        <CoursesPage isNight={isNight} onClose={() => setShowCourses(false)} />
      )}
      {/* Main content only if no overlay */}
      {!showAbout && !showContact && !showCourses && (
        <>
          <GameComponent
            isNight={isNight}
            showGameMenu={showGameMenu}
            onGameMenuToggle={handleGameMenuToggle}
            onTicTacToeClick={() => {
              setShowTicTacToe(!showTicTacToe)
              setShowGameMenu(false)
              setShowDrawing(false)
              setShowFootball(false)
            }}
            onDrawingClick={() => {
              setShowDrawing(true)
              setShowGameMenu(false)
              setShowTicTacToe(false)
              setShowFootball(false)
            }}
            onFootballClick={() => {
              setShowFootball(true)
              setShowGameMenu(false)
              setShowTicTacToe(false)
              setShowDrawing(false)
            }}
          />
          <MainBody
            isNight={isNight}
            showTicTacToe={showTicTacToe}
            setShowTicTacToe={setShowTicTacToe}
            showDrawing={showDrawing}
            setShowDrawing={setShowDrawing}
            showFootball={showFootball}
            setShowFootball={setShowFootball}
          />
        </>
      )}
      <Footer isNight={isNight} />
    </div>
  )
}

export default App

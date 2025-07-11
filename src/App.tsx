// src/App.tsx
import React, { useState, Suspense, MouseEvent } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header'
import Footer from './components/Footer'
import GameComponent from './components/GameComponent'
import AboutPage from './components/AboutPage'
import ContactPage from './components/ContactPage'
import CoursesPage from './components/CoursesPage'
import CircularHeader from './components/CircularHeader'
import Spinner from './components/Spinner'
import AirplaneBanner from './components/AirplaneBanner'
import StudentRegistrationForm from './components/StudentRegistrationForm';
import StudentListPage from './components/StudentListPage';

const MainBody = React.lazy(() => import('./components/MainBody'));

function App() {
  const [isNight, setIsNight] = useState(true)
  const [showGameMenu, setShowGameMenu] = useState(false)
  const [showTicTacToe, setShowTicTacToe] = useState(false)
  const [showDrawing, setShowDrawing] = useState(false)
  const [showFootball, setShowFootball] = useState(false)
  const [showAbout, setShowAbout] = useState(false)
  const [showContact, setShowContact] = useState(false)
  const [showCourses, setShowCourses] = useState(false)
  const [showRegistrationModal, setShowRegistrationModal] = useState(false)
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

  React.useEffect(() => {
    // Preload MainBody as soon as possible to avoid spinner blink after first mount
    import('./components/MainBody');
  }, []);

  return (
    <Router>
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
        <AirplaneBanner href="#" onClick={() => setShowRegistrationModal(true)} />
        <Routes>
          <Route
            path="/"
            element={
              <>
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
                {/* Registration Modal */}
                {showRegistrationModal && (
                  <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100vw',
                    height: '100vh',
                    background: 'rgba(0,0,0,0.35)',
                    zIndex: 2000,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <div style={{ position: 'relative', zIndex: 2001 }}>
                      <StudentRegistrationForm onSuccess={() => setShowRegistrationModal(false)} />
                      <button
                        onClick={() => setShowRegistrationModal(false)}
                        style={{
                          position: 'absolute',
                          top: 8,
                          right: 8,
                          background: '#232946',
                          color: '#fff',
                          border: 'none',
                          borderRadius: 16,
                          width: 32,
                          height: 32,
                          fontSize: 20,
                          fontWeight: 700,
                          cursor: 'pointer',
                          boxShadow: '0 2px 8px #0004',
                          zIndex: 2002
                        }}
                        aria-label="Close registration form"
                      >×</button>
                    </div>
                  </div>
                )}
                {/* MainBody is always mounted, but hidden when overlays are open */}
                <Suspense fallback={null}>
                  <div style={{ display: showAbout || showContact || showCourses ? 'none' : 'block' }}>
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
                  </div>
                </Suspense>
                <Footer isNight={isNight} />
              </>
            }
          />
          <Route path="/register" element={null} />
          <Route path="/students" element={<StudentListPage />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App

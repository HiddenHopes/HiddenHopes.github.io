// src/App.tsx
import React, { useState, Suspense, MouseEvent } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
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
import './i18n';

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
  const { i18n, t } = useTranslation();
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
      {/* Language Toggle - always visible */}
      <div style={{ position: 'fixed', top: 15, right: 70, zIndex: 5000 }}>
        <div
          onClick={() => {
            i18n.changeLanguage(i18n.language === 'en' ? 'bn' : 'en');
            localStorage.setItem('lang', i18n.language === 'en' ? 'bn' : 'en');
          }}
          style={{
            width: 80,
            height: 36,
            borderRadius: 18,
            background: '#51ff8b',
            position: 'relative',
            cursor: 'pointer',
            boxShadow: '0 2px 8px #51ff8b44',
            transition: 'all 0.3s ease',
            border: '2px solid #51ff8b',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 6px'
          }}
          // aria-label={t('header.toggle_en') + '/' + t('header.toggle_bn')}
        >
          {/* Language labels */}
          <span style={{
            fontSize: 10,
            fontWeight: 700,
            color: i18n.language === 'en' ? '#1976d2' : '#fff',
            transition: 'color 0.3s ease',
            zIndex: 2
          }}>EN</span>
          <span style={{
            fontSize: 10,
            fontWeight: 700,
            color: i18n.language === 'bn' ? '#1976d2' : '#fff',
            transition: 'color 0.3s ease',
            zIndex: 2
          }}>বাং</span>
          
          {/* Toggle slider */}
          <div style={{
            position: 'absolute',
            top: 2,
            left: i18n.language === 'en' ? 2 : 'calc(100% - 32px)',
            width: 30,
            height: 30,
            borderRadius: 15,
            background: '#fff',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
            transition: 'left 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <span style={{
              fontSize: 12,
              fontWeight: 700,
              color: '#1976d2'
            }}>
              {/* {i18n.language === 'en' ? 'EN' : 'বাং'} */}
            </span>
          </div>
        </div>
      </div>
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
        {!(showAbout || showContact || showCourses) && <AirplaneBanner href="#" onClick={() => setShowRegistrationModal(true)} />}
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

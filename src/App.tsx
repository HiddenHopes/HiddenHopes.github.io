// src/App.tsx
import React, { useState, Suspense, MouseEvent } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAtom } from 'jotai';
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
import { uiStatusArrayAtom } from './store/uiAtoms';
import { loadUiStatusArrayFromLocalStorage, saveUiStatusArrayToLocalStorage } from './store/utils';

const MainBody = React.lazy(() => import('./components/MainBody'));

function App() {
  // Indices for UI status array
  // 0: Night mode
  // 1: showGameMenu
  // 2: showTicTacToe
  // 3: showDrawing
  // 4: showFootball
  // 5: showAbout
  // 6: showContact
  // 7: showCourses
  // 8: showRegistrationModal
  const [expanded, setExpanded] = useState(false);
  const { i18n, t } = useTranslation();
  const [uiStatusArray, setUiStatusArray] = useAtom(uiStatusArrayAtom);

  const handleThemeToggle = () => {
    const newArray = [...uiStatusArray];
    newArray[0] = !uiStatusArray[0];
    setUiStatusArray(newArray);
  }
  const handleGameMenuToggle = () => {
    const newArray = [...uiStatusArray];
    newArray[1] = !uiStatusArray[1];
    setUiStatusArray(newArray);
  }
  const handleShowAbout = () => {
    const newArray = [...uiStatusArray];
    newArray[5] = true;
    newArray[6] = false;
    newArray[7] = false;
    setUiStatusArray(newArray);
  }
  const handleShowContact = () => {
    const newArray = [...uiStatusArray];
    newArray[6] = true;
    newArray[5] = false;
    newArray[7] = false;
    setUiStatusArray(newArray);
  }
  const handleShowCourses = () => {
    const newArray = [...uiStatusArray];
    newArray[7] = true;
    newArray[5] = false;
    newArray[6] = false;
    setUiStatusArray(newArray);
  }

  // Load from localStorage on mount
  React.useEffect(() => {
    setUiStatusArray(loadUiStatusArrayFromLocalStorage());
  }, [setUiStatusArray]);

  // Save to localStorage whenever the array changes
  React.useEffect(() => {
    saveUiStatusArrayToLocalStorage(uiStatusArray);
  }, [uiStatusArray]);

  React.useEffect(() => {
    // Preload MainBody as soon as possible to avoid spinner blink after first mount
    import('./components/MainBody');
  }, []);

  return (
    <Router>
      {/* Language Toggle - always visible */}
      <div style={{ position: 'fixed', top: 14, right: 70, zIndex: 5000 }}>
        <div
          onClick={() => {
            i18n.changeLanguage(i18n.language === 'en' ? 'bn' : 'en');
            localStorage.setItem('lang', i18n.language === 'en' ? 'bn' : 'en');
          }}
          style={{
            width: 60,
            height: 30,
            borderRadius: 18,
            background: '#517fff36',
            position: 'relative',
            cursor: 'pointer',
            boxShadow: '0 2px 8px #51ff8b44',
            transition: 'all 0.3s ease',
            border: '1px solid #7fbb1f07',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 8px'
          }}
          // aria-label={t('header.toggle_en') + '/' + t('header.toggle_bn')}
        >
          {/* Language labels */}
          <span style={{
            fontSize: 12,
            fontWeight: 700,
            color: i18n.language === 'en' ? '#8ce084ff' : '#fff',
            transition: 'color 0.3s ease',
            zIndex: 2
          }}>EN</span>
          <span style={{
            fontSize: 12,
            fontWeight: 700,
            color: i18n.language === 'bn' ? '#8ce084ff' : '#fff',
            transition: 'color 0.3s ease',
            zIndex: 2
          }}>বাং</span>
          
          {/* Toggle slider */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: i18n.language === 'en' ? 0 : 'calc(100% - 40px)',
            width: 40,
            height: 30,
            borderRadius: 14,
            background: '#1f912e4f',
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
          background: uiStatusArray[0]
            ? 'radial-gradient(ellipse at 50% 80%,rgb(24, 55, 133) 0%, #090a0f 100%)'
            : 'linear-gradient(to bottom, #e3f6ff 0%, #b3e0ff 100%)'
        }}
      >
        {!(uiStatusArray[5] || uiStatusArray[6] || uiStatusArray[7] || expanded) && <AirplaneBanner href="#" onClick={() => {
          const newArray = [...uiStatusArray];
          newArray[8] = true;
          setUiStatusArray(newArray);
        }} />}
        <Routes>
          <Route
            path="/"
            element={
              <>
                <CircularHeader
                  isNight={uiStatusArray[0]}
                  onThemeToggle={handleThemeToggle}
                  onAboutClick={handleShowAbout}
                  onContactClick={handleShowContact}
                  onCoursesClick={handleShowCourses}
                  expanded={expanded}
                  setExpanded={setExpanded}
                />
                {/* Show overlay pages if active */}
                {uiStatusArray[5] && (
                  <AboutPage isNight={uiStatusArray[0]} onClose={() => {
                    const newArray = [...uiStatusArray];
                    newArray[5] = false;
                    setUiStatusArray(newArray);
                  }} />
                )}
                {uiStatusArray[6] && (
                  <ContactPage isNight={uiStatusArray[0]} onClose={() => {
                    const newArray = [...uiStatusArray];
                    newArray[6] = false;
                    setUiStatusArray(newArray);
                  }} />
                )}
                {uiStatusArray[7] && (
                  <CoursesPage isNight={uiStatusArray[0]} onClose={() => {
                    const newArray = [...uiStatusArray];
                    newArray[7] = false;
                    setUiStatusArray(newArray);
                  }} />
                )}
                {/* Registration Modal */}
                {uiStatusArray[8] && (
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
                      <StudentRegistrationForm onSuccess={() => {
                        const newArray = [...uiStatusArray];
                        newArray[8] = false;
                        setUiStatusArray(newArray);
                      }} onClose={() => {
                        const newArray = [...uiStatusArray];
                        newArray[8] = false;
                        setUiStatusArray(newArray);
                      }} />
                    </div>
                  </div>
                )}
                {/* MainBody is always mounted, but hidden when overlays are open */}
                <Suspense fallback={null}>
                  <div style={{ display: uiStatusArray[5] || uiStatusArray[6] || uiStatusArray[7] ? 'none' : 'block' }}>
                    <GameComponent
                      isNight={uiStatusArray[0]}
                      showGameMenu={uiStatusArray[1]}
                      onGameMenuToggle={handleGameMenuToggle}
                      onTicTacToeClick={() => {
                        const newArray = [...uiStatusArray];
                        newArray[2] = !uiStatusArray[2];
                        newArray[1] = false;
                        newArray[3] = false;
                        newArray[4] = false;
                        setUiStatusArray(newArray);
                      }}
                      onDrawingClick={() => {
                        const newArray = [...uiStatusArray];
                        newArray[3] = true;
                        newArray[1] = false;
                        newArray[2] = false;
                        newArray[4] = false;
                        setUiStatusArray(newArray);
                      }}
                      onFootballClick={() => {
                        const newArray = [...uiStatusArray];
                        newArray[4] = true;
                        newArray[1] = false;
                        newArray[2] = false;
                        newArray[3] = false;
                        setUiStatusArray(newArray);
                      }}
                    />
                    <MainBody
                      isNight={uiStatusArray[0]}
                      showTicTacToe={uiStatusArray[2]}
                      setShowTicTacToe={(val) => {
                        const newArray = [...uiStatusArray];
                        newArray[2] = val;
                        setUiStatusArray(newArray);
                      }}
                      showDrawing={uiStatusArray[3]}
                      setShowDrawing={(val) => {
                        const newArray = [...uiStatusArray];
                        newArray[3] = val;
                        setUiStatusArray(newArray);
                      }}
                      showFootball={uiStatusArray[4]}
                      setShowFootball={(val) => {
                        const newArray = [...uiStatusArray];
                        newArray[4] = val;
                        setUiStatusArray(newArray);
                      }}
                    />
                  </div>
                </Suspense>
                <Footer isNight={uiStatusArray[0]} />
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

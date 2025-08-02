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
import { saveUiStatusArrayToLocalStorage } from './store/utils';
import { Status } from './store/statusEnum';

const MainBody = React.lazy(() => import('./components/MainBody'));

function App() {
  const { i18n, t } = useTranslation();
  const [uiStatusArray, setUiStatusArray] = useAtom(uiStatusArrayAtom);
  const [isInitialized, setIsInitialized] = React.useState(false);

  const handleThemeToggle = () => {
    const newArray = [...uiStatusArray];
    newArray[Status.Night] = !uiStatusArray[Status.Night];
    setUiStatusArray(newArray);
  }
  const handleGameMenuToggle = () => {
    const newArray = [...uiStatusArray];
    newArray[Status.GameMenu] = !uiStatusArray[Status.GameMenu];
    setUiStatusArray(newArray);
  }
  const handleShowAbout = () => {
    const newArray = [...uiStatusArray];
    newArray[Status.About] = true;
    newArray[Status.Contact] = false;
    newArray[Status.Courses] = false;
    setUiStatusArray(newArray);
  }
  const handleShowContact = () => {
    const newArray = [...uiStatusArray];
    newArray[Status.Contact] = true;
    newArray[Status.About] = false;
    newArray[Status.Courses] = false;
    setUiStatusArray(newArray);
  }
  const handleShowCourses = () => {
    const newArray = [...uiStatusArray];
    newArray[Status.Courses] = true;
    newArray[Status.About] = false;
    newArray[Status.Contact] = false;
    setUiStatusArray(newArray);
  }

  // Default UI state array (night, 12, 13 true)
  const defaultUiStatusArray = React.useMemo(() => {
    const arr = Array(20).fill(false);
    arr[1] = true;
    arr[12] = true;
    arr[13] = true;
    return arr;
  }, []);

  // Load from localStorage on mount, else use default
  React.useEffect(() => {
    const val = localStorage.getItem('uiStatusArray');
    let arr;
    try {
      arr = val ? JSON.parse(val) : null;
    } catch {
      arr = null;
    }
    if (Array.isArray(arr) && arr.length === 20 && arr.every(v => typeof v === 'boolean')) {
      setUiStatusArray(arr);
    } else {
      setUiStatusArray(defaultUiStatusArray);
    }
    setIsInitialized(true);
  }, [setUiStatusArray, defaultUiStatusArray]);

  // Save to localStorage whenever the array changes (but not on initial load)
  React.useEffect(() => {
    if (!isInitialized) return;
    saveUiStatusArrayToLocalStorage(uiStatusArray);
  }, [uiStatusArray, isInitialized]);

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
          background: uiStatusArray[Status.Night]
            ? 'radial-gradient(ellipse at 50% 80%,rgb(24, 55, 133) 0%, #090a0f 100%)'
            : 'linear-gradient(to bottom, #e3f6ff 0%, #b3e0ff 100%)'
        }}
      >
        {!(uiStatusArray[Status.Contact] || uiStatusArray[Status.Courses] || uiStatusArray[Status.RegistrationModal] || uiStatusArray[Status.NavExpanded]) && <AirplaneBanner href="#" onClick={() => {
          const newArray = [...uiStatusArray];
          newArray[Status.RegistrationModal] = true;
          setUiStatusArray(newArray);
        }} />}
        <Routes>
          <Route
            path="/"
            element={
              <>
                <CircularHeader
                  isNight={uiStatusArray[Status.Night]}
                  onThemeToggle={handleThemeToggle}
                  onAboutClick={handleShowAbout}
                  onContactClick={handleShowContact}
                  onCoursesClick={handleShowCourses}
                />
                {/* Show overlay pages if active */}
                {uiStatusArray[Status.About] && (
                  <AboutPage isNight={uiStatusArray[Status.Night]} onClose={() => {
                    const newArray = [...uiStatusArray];
                    newArray[Status.About] = false;
                    setUiStatusArray(newArray);
                  }} />
                )}
                {uiStatusArray[Status.Contact] && (
                  <ContactPage isNight={uiStatusArray[Status.Night]} onClose={() => {
                    const newArray = [...uiStatusArray];
                    newArray[Status.Contact] = false;
                    setUiStatusArray(newArray);
                  }} />
                )}
                {uiStatusArray[Status.Courses] && (
                  <CoursesPage isNight={uiStatusArray[Status.Night]} onClose={() => {
                    const newArray = [...uiStatusArray];
                    newArray[Status.Courses] = false;
                    setUiStatusArray(newArray);
                  }} />
                )}
                {/* Registration Modal */}
                {uiStatusArray[Status.RegistrationModal] && (
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
                        newArray[Status.RegistrationModal] = false;
                        setUiStatusArray(newArray);
                      }} onClose={() => {
                        const newArray = [...uiStatusArray];
                        newArray[Status.RegistrationModal] = false;
                        setUiStatusArray(newArray);
                      }} />
                    </div>
                  </div>
                )}
                {/* MainBody is always mounted, but hidden when overlays are open */}
                <Suspense fallback={null}>
                  <div style={{ display: uiStatusArray[Status.About] || uiStatusArray[Status.Contact] || uiStatusArray[Status.Courses] ? 'none' : 'block' }}>
                    <GameComponent
                      isNight={uiStatusArray[Status.Night]}
                      showGameMenu={uiStatusArray[Status.GameMenu]}
                      onGameMenuToggle={handleGameMenuToggle}
                      onTicTacToeClick={() => {
                        const newArray = [...uiStatusArray];
                        newArray[Status.TicTacToe] = !uiStatusArray[Status.TicTacToe];
                        newArray[Status.GameMenu] = false;
                        newArray[Status.Drawing] = false;
                        newArray[Status.Football] = false;
                        setUiStatusArray(newArray);
                      }}
                      onDrawingClick={() => {
                        const newArray = [...uiStatusArray];
                        newArray[Status.Drawing] = true;
                        newArray[Status.GameMenu] = false;
                        newArray[Status.TicTacToe] = false;
                        newArray[Status.Football] = false;
                        setUiStatusArray(newArray);
                      }}
                      onFootballClick={() => {
                        const newArray = [...uiStatusArray];
                        newArray[Status.Football] = true;
                        newArray[Status.GameMenu] = false;
                        newArray[Status.TicTacToe] = false;
                        newArray[Status.Drawing] = false;
                        setUiStatusArray(newArray);
                      }}
                    />
                    <MainBody
                      isNight={uiStatusArray[Status.Night]}
                      showTicTacToe={uiStatusArray[Status.TicTacToe]}
                      setShowTicTacToe={(val) => {
                        const newArray = [...uiStatusArray];
                        newArray[Status.TicTacToe] = val;
                        setUiStatusArray(newArray);
                      }}
                      showDrawing={uiStatusArray[Status.Drawing]}
                      setShowDrawing={(val) => {
                        const newArray = [...uiStatusArray];
                        newArray[Status.Drawing] = val;
                        setUiStatusArray(newArray);
                      }}
                      showFootball={uiStatusArray[Status.Football]}
                      setShowFootball={(val) => {
                        const newArray = [...uiStatusArray];
                        newArray[Status.Football] = val;
                        setUiStatusArray(newArray);
                      }}
                    />
                  </div>
                </Suspense>
                <Footer isNight={uiStatusArray[Status.Night]} />
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

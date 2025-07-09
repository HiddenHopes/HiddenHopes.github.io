import React from 'react';
import { FaMoon, FaSun, FaRegCalendarAlt, FaCloudSun } from 'react-icons/fa';
import WeatherUpdate from './WeatherUpdate';
import DateTimePopup from './DateTimePopup';

interface CircularHeaderProps {
  isNight: boolean;
  onThemeToggle: () => void;
  onAboutClick?: () => void;
  onContactClick?: () => void;
  onCoursesClick?: () => void;
}

const BUTTONS = [
  {
    key: 'home',
    label: 'Home',
    icon: <span role="img" aria-label="home">🏠</span>,
    onClickProp: 'onHomeClick',
  },
  {
    key: 'courses',
    label: 'Courses',
    icon: <span role="img" aria-label="courses">📚</span>,
    onClickProp: 'onCoursesClick',
  },
  {
    key: 'weather',
    label: 'Weather',
    icon: null, // handled below
    onClickProp: null,
  },
  {
    key: 'calendar',
    label: 'Date & Time',
    icon: <FaRegCalendarAlt style={{ color: '#ffa751', fontSize: 22 }} />,
    onClickProp: null,
  },
  {
    key: 'about',
    label: 'About',
    icon: <span role="img" aria-label="about">ℹ️</span>,
    onClickProp: 'onAboutClick',
  },
  {
    key: 'contact',
    label: 'Contact',
    icon: <span role="img" aria-label="contact">✉️</span>,
    onClickProp: 'onContactClick',
  },
];

const CircularHeader: React.FC<CircularHeaderProps> = ({ isNight, onThemeToggle, onAboutClick, onContactClick, onCoursesClick }) => {
  const [expanded, setExpanded] = React.useState(false);
  const [showCalendar, setShowCalendar] = React.useState(false);
  const [showWeather, setShowWeather] = React.useState(false);

  // Close nav when clicking outside
  React.useEffect(() => {
    if (!expanded) return;
    const handleClick = (e: MouseEvent) => {
      // Only close if click is outside the nav area
      const nav = document.getElementById('circular-header-nav');
      if (nav && !nav.contains(e.target as Node)) {
        setExpanded(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [expanded]);

  // Button positions: fan out to the right in an arc (umbrella style)
  const buttonCount = BUTTONS.length;
  const arcDegrees = 90; // umbrella arc
  const radius = 180;
  const startAngle = -1; // slight upward tilt

  // Weather icon for nav button
  const weatherIcon = <FaCloudSun style={{ color: '#f7c948', filter: 'drop-shadow(0 0 2px #f7c948)' }} />;

  // Button click handlers
  const handleButtonClick = (btn: any) => {
    if (btn.key === 'home') {
      window.location.replace('/');
      setExpanded(false);
      return;
    }
    else if (btn.key === 'weather') setShowWeather(v => !v);
    else if (btn.key === 'calendar') setShowCalendar(v => !v);
    else if (btn.key === 'about' && onAboutClick) onAboutClick();
    else if (btn.key === 'contact' && onContactClick) onContactClick();
    else if (btn.key === 'courses' && onCoursesClick) onCoursesClick();
    setExpanded(false);
  };

  return (
    <div
      id="circular-header-nav"
      style={{
        position: 'fixed',
        top: 20,
        left: 20,
        zIndex: 200,
        pointerEvents: 'none',
      }}
    >
      {/* Mother Button */}
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: '50%',
          background: 'rgba(30,34,40,0.7)',
          border: '3px solid #51ff8b',
          boxShadow: expanded
            ? '0 0 32px 8px #51ff8b88, 0 4px 24px #b3e0ff44'
            : '0 2px 8px #b3e0ff44',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          
          cursor: 'pointer',
          transition: 'box-shadow 0.4s',
          position: 'relative',
          pointerEvents: 'auto',
        }}
        onClick={() => setExpanded(v => !v)}
        title="Show Menu"
      >
        <span
          style={{
            fontSize: 38,
            color: '#51ff8b',
            userSelect: 'none',
            transition: 'transform 0.3s',
            transform: expanded ? 'rotate(90deg)' : 'none',
            textShadow: '0 0 8px #51ff8b88',
          }}
        >
          ☰
        </span>
        
      </div>
      {/* Fan-out Buttons */}
      {expanded && (
        <div
          style={{
            position: 'absolute',
            left: 65,
            top: 55,
            height: 0,
            width: radius + 60,
            display: 'flex',
            alignItems: 'center',
            pointerEvents: 'none',
            animation: 'fadeInNav 0.3s'

          }}
        >
          {BUTTONS.map((btn, i) => {
            const angle = startAngle + (arcDegrees / (buttonCount - 1)) * i;
            const rad = (angle * Math.PI) / 165;
            const buttonSpacing = 20;
            // Calculate the final position relative to the mother button center
            const x = Math.cos(rad) * radius;
            const y = Math.sin(rad) * radius + i * buttonSpacing;
            let icon = btn.icon;
            if (btn.key === 'weather') icon = weatherIcon;
            const handleNavClick = (e: React.MouseEvent) => {
              e.stopPropagation();
              handleButtonClick(btn);
              setExpanded(false);
            };
            return (
              <React.Fragment key={btn.key}>
                {/* Connector wire for each button */}
                <svg
                  width={Math.abs(x) + 60}
                  height={Math.abs(y) + 60}
                  style={{
                    position: 'absolute',
                    left: x,
                    top: y,
                    pointerEvents: 'none',
                    zIndex: 1,
                    overflow: 'visible',
                  }}
                >
                  <line
                    x1={-x}
                    y1={-y}
                    x2={30} // slight downward tilt
                    y2={10} // slight upward tilt
                    stroke="#51ff8b"
                    strokeWidth="4"
                    strokeDasharray="8 4"
                    filter="url(#glow)"
                    opacity={0.2}
                  />
                </svg>
                <button
                  onClick={handleNavClick}
                  title={btn.label}
                  style={{
                    position: 'absolute',
                    left: x,
                    top: y-20,
                    opacity: expanded ? 1 : 0,
                    transform: expanded
                      ? 'scale(1)'
                      : 'scale(0.2)',
                    transitionProperty: 'transform, opacity',
                    transitionDuration: expanded ? '0.7s, 0.5s' : '0.4s, 0.3s',
                    transitionTimingFunction: 'cubic-bezier(.4,0,.2,1)',
                    transitionDelay: expanded ? `${i * 0.08 + 0.1}s, ${i * 0.08 + 0.1}s` : '0s, 0s',
                    width: 60,
                    height: 60,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #232946 0%, #51ff8b 100%)',
                    boxShadow: '0 2px 12px #51ff8b44, 0 0 8px #b3e0ff44',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 24,
                    border: '2.5px solid #51ff8b',
                    color: '#fff',
                    pointerEvents: 'auto',
                    zIndex: 2,
                    filter: 'drop-shadow(0 0 8px #51ff8b88)',
                    backdropFilter: 'blur(2px)',
                    animation: expanded ? `bounceOut 0.5s ${i * 0.08 + 0.07}s both` : 'none',
                  }}
                >
                  {icon}
                </button>
              </React.Fragment>
            );
          })}
        </div>
      )}

      {showCalendar && (
        <div
          style={{
            position: 'fixed',
            top: 90,
            left: 0,
            width: '100vw',
            display: 'flex',
            justifyContent: 'center',
            zIndex: 9999,
            pointerEvents: 'none',
          }}
        >
          <div style={{ position: 'relative', maxWidth: 400, width: '95vw', pointerEvents: 'auto' }}>
            <DateTimePopup onClose={() => setShowCalendar(false)} />
          </div>
        </div>
      )}

      {showWeather && (
        <div
          style={{
            position: 'fixed',
            top: 90,
            left: 0,
            width: '100vw',
            display: 'flex',
            justifyContent: 'center',
            zIndex: 9999,
            pointerEvents: 'none',
          }}
        >
          <div style={{ position: 'relative', maxWidth: 400, width: '95vw', pointerEvents: 'auto' }}>
            <WeatherUpdate onClose={() => setShowWeather(false)} />
          </div>
        </div>
      )}
      {/* Theme toggle button (ensure not covered by pointerEvents: 'none') */}
      <button
        onClick={onThemeToggle}
        title={`Switch to ${isNight ? 'Day' : 'Night'} mode`}
        className={`theme-toggle-btn ${isNight ? 'night' : 'day'}`}
        style={{
          position: 'fixed',
          top: 10,
          right: 10,
          zIndex: 300,
          width: 46,
          height: 46,
          background: isNight
            ? 'linear-gradient(135deg, #232946 0%, #1b2735 100%)'
            : 'linear-gradient(135deg, #ffe259 0%, #ffa751 100%)',
          color: isNight ? '#ffe259' : '#232946',
          border: 'none',
          borderRadius: '50%',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.5rem',
          transition: 'background 0.5s, color 0.5s, box-shadow 0.5s',
          animation: isNight
            ? 'nightGlow 2s infinite alternate'
            : 'dayGlow 2s infinite alternate',
          pointerEvents: 'auto', // <-- ensure button is clickable
        }}
      >
        {isNight ? <FaMoon /> : <FaSun />}
      </button>
      <style>
      {`
        @keyframes fadeInNav {
          from { opacity: 0; transform: translateX(-10px);}
          to { opacity: 1; transform: translateX(0);}
        }
        @keyframes bounceOut {
          0%   { transform: scale(0); }
          80%  { transform: scale(1.1); }
          100% { transform: scale(1); }
        }
      `}
    </style>
    </div>
  );
};

export default CircularHeader;

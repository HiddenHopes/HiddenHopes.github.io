import React from 'react'
import Navbar from './Navbar'
import { FaMoon, FaSun, FaRegCalendarAlt, FaRegClock } from 'react-icons/fa'
import WeatherUpdate from './WeatherUpdate'
import DateTimePopup from './DateTimePopup'
import FootballResults from './FootballResults'

interface HeaderProps {
  isNight: boolean
  onThemeToggle: () => void
}

const Header: React.FC<HeaderProps> = ({ isNight, onThemeToggle }) => {
  const [showDateTime, setShowDateTime] = React.useState(false);
  const [showFootball, setShowFootball] = React.useState(false);
  // Local date/time state
  const [now, setNow] = React.useState(new Date());
  React.useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header  
      style={{
        width: '100%',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 10,
        background: isNight
          ? 'linear-gradient(90deg,rgb(28, 89, 158) 0%,rgb(1, 3, 37) 100%)'
          : 'linear-gradient(90deg,rgb(247, 248, 248) 0%,rgb(140, 203, 245) 100%)',
        color: isNight ? '#fff' : '#232946',
        boxShadow: isNight
          ? '0 2px 8px rgba(0,0,0,0.15)'
          : '0 2px 8px rgba(0,0,0,0.05)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        transition: 'background 0.5s, color 0.5s, box-shadow 0.5s'
      }}
    >
      <Navbar isNight={isNight} />
      {/* Weather Update Button */}
      <div style={{ position: 'absolute', top: 10, right: 90, zIndex: 21, display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        {/* Date/Time Button as one unit, stacked */}
        <div
          style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', fontWeight: 600, fontSize: 14, color: '#232946', background: '#fff', borderRadius: 8, padding: '6px 16px', boxShadow: '0 2px 8px #b3e0ff22', cursor: 'pointer', minWidth: 120
          }}
          onClick={() => setShowDateTime(true)}
          title="Show Date & Time"
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <FaRegCalendarAlt style={{ color: '#ffa751', fontSize: 16 }} />
            {now.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2, width: '106px' }}>
            <FaRegClock style={{ color: '#1976d2', fontSize: 16 }} />
            <span style={{ fontFamily: 'monospace', minWidth: 80, display: 'inline-block', textAlign: 'center' }}>
              {now.getHours().toString().padStart(2, '0')}
              :{now.getMinutes().toString().padStart(2, '0')}
              {/* :{now.getSeconds().toString().padStart(2, '0')} */}
              {now.toLocaleTimeString().replace(/.*(AM|PM)$/i, ' $1')}
            </span>
          </span>
        </div>
        {/* Football Results Button BESIDE date-time, not above */}
        <button
          onClick={() => setShowFootball(true)}
          title="Show Football Results"
          style={{
            width: 46,
            height: 46,
            background: 'linear-gradient(135deg, #b3e0ff 0%, #51ff8b 100%)',
            color: '#232946',
            border: 'none',
            borderRadius: '50%',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.3rem',
            boxShadow: '0 2px 8px #b3e0ff88',
          }}
        >
          <span role="img" aria-label="football">⚽</span>
        </button>
        {showFootball && (
          <FootballResults onClose={() => setShowFootball(false)} />
        )}
        <WeatherUpdate />
        {showDateTime && <DateTimePopup onClose={() => setShowDateTime(false)} />}
      </div>
      <div style={{ position: 'absolute', top: 10, right: 210, zIndex: 22 }}>
      </div>
      {/* Theme Toggle Button */}
      <button
        onClick={onThemeToggle}
        title={`Switch to ${isNight ? 'Day' : 'Night'} mode`}
        className={`theme-toggle-btn ${isNight ? 'night' : 'day'}`}
        style={{
          position: 'absolute',
          top: 10,
          right: 32,
          zIndex: 20,
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
            : 'dayGlow 2s infinite alternate'
        }}
      >
        {isNight ? <FaMoon /> : <FaSun />}
      </button>
      <style>
        {`
          .theme-toggle-btn.night:hover {
            box-shadow: 0 0 32px 8px #ffe259cc, 0 4px 24px #b3e0ff88;
          }
          .theme-toggle-btn.day:hover {
            box-shadow: 0 0 32px 8px #ffe259cc, 0 4px 24px #b3e0ff88;
          }
        `}
      </style>
    </header>
  );
};

export default Header;
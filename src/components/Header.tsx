import React from 'react'
import Navbar from './Navbar'
import { FaMoon, FaSun } from 'react-icons/fa'
import WeatherUpdate from './WeatherUpdate'

interface HeaderProps {
  isNight: boolean
  onThemeToggle: () => void
}

const Header: React.FC<HeaderProps> = ({ isNight, onThemeToggle }) => (
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
    <div style={{ position: 'absolute', top: 16, right: 90, zIndex: 21 }}>
      <WeatherUpdate />
    </div>
    {/* Theme Toggle Button */}
    <button
      onClick={onThemeToggle}
      title={`Switch to ${isNight ? 'Day' : 'Night'} mode`}
      className={`theme-toggle-btn ${isNight ? 'night' : 'day'}`}
      style={{
        position: 'absolute',
        top: 16,
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
      <span
        style={{
          transition: 'transform 0.5s',
          transform: isNight ? 'rotate(0deg)' : 'rotate(180deg)',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        {isNight ? <FaMoon /> : <FaSun />}
      </span>
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
)

export default Header
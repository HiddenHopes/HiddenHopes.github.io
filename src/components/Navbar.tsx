import React from 'react'
import { useTranslation } from 'react-i18next'

interface NavbarProps {
  isNight: boolean;
  onAboutClick?: () => void;
  onContactClick?: () => void;
  onCoursesClick?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ isNight, onAboutClick, onContactClick, onCoursesClick }) => {
  const { t } = useTranslation();
  
  return (
    <nav
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '1rem 2rem',
        background: 'transparent',
        color: isNight ? '#ffffff' : '#222222',
        fontWeight: 600,
        fontSize: '1.2rem',
        letterSpacing: '0.05em',
        width: '100%',
        transition: 'color 0.3s'
      }}
    >
      {/* Logo and Title */}
      <div style={{ display: 'flex', alignItems: 'center', marginRight: '2rem' }}>
        <img 
          src="logo.png" 
          alt="School Of Happiness Logo" 
          style={{ 
            height: '32px', 
            width: 'auto', 
            marginRight: '10px' 
          }} 
        />
        <span style={{ fontWeight: 700 }}>{t('header.title')}</span>
      </div>
      <a
        href="/"
        className={`nav-link ${isNight ? 'night' : 'day'}`}
        style={{
          color: isNight ? '#ffffff' : '#222222',
          marginRight: '1.5rem',
          textDecoration: 'none',
          position: 'relative',
          transition: 'color 0.3s'
        }}
      >
        {t('nav.home')}
      </a>
      <a
        href="#about"
        className={`nav-link ${isNight ? 'night' : 'day'}`}
        style={{
          color: isNight ? '#ffffff' : '#222222',
          marginRight: '1.5rem',
          textDecoration: 'none',
          position: 'relative',
          transition: 'color 0.3s',
          cursor: 'pointer'
        }}
        onClick={e => {
          e.preventDefault();
          if (onAboutClick) onAboutClick();
        }}
      >
        {t('nav.about')}
      </a>
      <a
        href="#courses"
        className={`nav-link ${isNight ? 'night' : 'day'}`}
        style={{
          color: isNight ? '#ffffff' : '#222222',
          marginRight: '1.5rem',
          textDecoration: 'none',
          position: 'relative',
          transition: 'color 0.3s',
          cursor: 'pointer'
        }}
        onClick={e => {
          e.preventDefault();
          if (onCoursesClick) onCoursesClick();
        }}
      >
        {t('nav.courses')}
      </a>
      <a
        href="#contact"
        className={`nav-link ${isNight ? 'night' : 'day'}`}
        style={{
          color: isNight ? '#ffffff' : '#222222',
          textDecoration: 'none',
          position: 'relative',
          transition: 'color 0.3s',
          cursor: 'pointer'
        }}
        onClick={e => {
          e.preventDefault();
          if (onContactClick) onContactClick();
        }}
      >
        {t('nav.contact')}
      </a>
      <style>
        {`
          .nav-link {
            overflow: hidden;
          }
          .nav-link::after {
            content: '';
            display: block;
            width: 0;
            height: 3px;
            background: linear-gradient(90deg, #ffe259, #ffa751, #b3e0ff, #232946);
            transition: width 0.4s cubic-bezier(.4,0,.2,1);
            border-radius: 2px;
            margin-top: 4px;
          }
          .nav-link:hover::after {
            width: 100%;
          }
          .nav-link.night:hover {
            color: rgb(81, 255, 139) !important;
            text-shadow: 0 2px 8px #51ff8b88, 0 0px 2px #23294644;
            transition: color 0.3s, text-shadow 0.3s;
          }
          .nav-link.day:hover {
            color:rgb(255, 174, 81) !important;
            text-shadow: 0 2px 8px #ffe25988, 0 0px 2px #b3e0ff44;
            transition: color 0.3s, text-shadow 0.3s;
          }
        `}
      </style>
    </nav>
  )
}

export default Navbar
import React from 'react'

interface NavbarProps {
  isNight: boolean;
  onAboutClick?: () => void;
  onContactClick?: () => void;
  onCoursesClick?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ isNight, onAboutClick, onContactClick, onCoursesClick }) => {
  const [menuOpen, setMenuOpen] = React.useState(false);

  return (
    <nav
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '1rem 2rem',
        background: 'transparent',
        color: isNight ? '#fff' : '#222',
        fontWeight: 600,
        fontSize: '1.2rem',
        letterSpacing: '0.05em',
        width: '100%',
        transition: 'color 0.3s',
        position: 'relative'
      }}
    >
      {/* Hamburger for mobile */}
      <button
        className="navbar-hamburger"
        aria-label="Open menu"
        style={{
          display: 'none',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          width: 40,
          height: 40,
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          marginRight: 8
        }}
        onClick={() => setMenuOpen(v => !v)}
      >
        <span className="navbar-hamburger-bar" style={{ width: 26, height: 3, background: isNight ? '#fff' : '#232946', margin: '3px 0', borderRadius: 2, transition: 'background 0.3s' }} />
        <span className="navbar-hamburger-bar" style={{ width: 26, height: 3, background: isNight ? '#fff' : '#232946', margin: '3px 0', borderRadius: 2, transition: 'background 0.3s' }} />
        <span className="navbar-hamburger-bar" style={{ width: 26, height: 3, background: isNight ? '#fff' : '#232946', margin: '3px 0', borderRadius: 2, transition: 'background 0.3s' }} />
      </button>
      <span className="school-of-happiness" style={{ marginRight: '2rem', fontWeight: 700 }}>School of Happiness</span>
      {/* Nav links (desktop) */}
      <div className="navbar-links" style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
        <a
          href="/"
          className={`nav-link ${isNight ? 'night' : 'day'}`}
          style={{
            color: isNight ? '#fff' : '#222',
            marginRight: '1.5rem',
            textDecoration: 'none',
            position: 'relative',
            transition: 'color 0.3s'
          }}
        >
          Home
        </a>
        <a
          href="#about"
          className={`nav-link ${isNight ? 'night' : 'day'}`}
          style={{
            color: isNight ? '#fff' : '#222',
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
          About
        </a>
        <a
          href="#courses"
          className={`nav-link ${isNight ? 'night' : 'day'}`}
          style={{
            color: isNight ? '#fff' : '#222',
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
          Courses
        </a>
        <a
          href="#contact"
          className={`nav-link ${isNight ? 'night' : 'day'}`}
          style={{
            color: isNight ? '#fff' : '#222',
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
          Contact
        </a>
      </div>
      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="navbar-dropdown" style={{
          position: 'absolute',
          top: '100%',
          width: '250px',
          background: isNight ? 'rgb(35, 41, 70, 0.4)' : 'rgb(140, 203, 245, 0.5)',
          boxShadow: '0 4px 16px #0002',
          borderRadius: '0 0 8px 8px',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 100,
          padding: '0.5rem 0'
        }}>
          <a href="/" className="nav-link" style={{ padding: '0.7rem 1.5rem', color: isNight ? '#fff' : '#232946', textDecoration: 'none', fontSize: '1.1rem', borderBottom: '1px solid #eee' }}>Home</a>
          <a href="#about" className="nav-link" style={{ padding: '0.7rem 1.5rem', color: isNight ? '#fff' : '#232946', textDecoration: 'none', fontSize: '1.1rem', borderBottom: '1px solid #eee' }} onClick={e => { e.preventDefault(); if (onAboutClick) onAboutClick(); }}>About</a>
          <a href="#courses" className="nav-link" style={{ padding: '0.7rem 1.5rem', color: isNight ? '#fff' : '#232946', textDecoration: 'none', fontSize: '1.1rem', borderBottom: '1px solid #eee' }} onClick={e => { e.preventDefault(); if (onCoursesClick) onCoursesClick(); }}>Courses</a>
          <a href="#contact" className="nav-link" style={{ padding: '0.7rem 1.5rem', color: isNight ? '#fff' : '#232946', textDecoration: 'none', fontSize: '1.1rem' }} onClick={e => { e.preventDefault(); if (onContactClick) onContactClick(); }}>Contact</a>
        </div>
      )}
      <style>{`
        @media (max-width: 700px) {
          .navbar-links {
            display: none !important;
          }
          .navbar-hamburger {
            display: flex !important;
          }
          .navbar-dropdown {
            display: flex !important;
          }
          .school-of-happiness {
            display: none !important;
          }
        }
        @media (min-width: 701px) {
          .navbar-links {
            display: flex !important;
          }
          .navbar-hamburger {
            display: none !important;
          }
          .navbar-dropdown {
            display: none !important;
          }
        }
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
      `}</style>
    </nav>
  )
}

export default Navbar
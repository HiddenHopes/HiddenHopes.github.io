import React from 'react'

interface NavbarProps {
  isNight: boolean
}

const Navbar: React.FC<NavbarProps> = ({ isNight }) => (
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
      transition: 'color 0.3s'
    }}
  >
    <span style={{ marginRight: '2rem', fontWeight: 700 }}>School of Happiness</span>
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
        transition: 'color 0.3s'
      }}
    >
      About
    </a>
    <a
      href="#contact"
      className={`nav-link ${isNight ? 'night' : 'day'}`}
      style={{
        color: isNight ? '#fff' : '#222',
        textDecoration: 'none',
        position: 'relative',
        transition: 'color 0.3s'
      }}
    >
      Contact
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

export default Navbar
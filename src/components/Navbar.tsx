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
    <a href="/" style={{ color: isNight ? '#fff' : '#222', marginRight: '1.5rem', textDecoration: 'none' }}>Home</a>
    <a href="#about" style={{ color: isNight ? '#fff' : '#222', marginRight: '1.5rem', textDecoration: 'none' }}>About</a>
    <a href="#contact" style={{ color: isNight ? '#fff' : '#222', textDecoration: 'none' }}>Contact</a>
  </nav>
)

export default Navbar
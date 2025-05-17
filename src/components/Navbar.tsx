import React from 'react'

const Navbar: React.FC = () => (
  <nav style={{
    display: 'flex',
    alignItems: 'center',
    padding: '1rem 2rem',
    background: 'rgba(20, 30, 40, 0.95)',
    color: '#fff',
    fontWeight: 600,
    fontSize: '1.2rem',
    letterSpacing: '0.05em',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  }}>
    <span style={{ marginRight: '2rem', fontWeight: 700 }}>School of Happiness</span>
    <a href="/" style={{ color: '#fff', marginRight: '1.5rem', textDecoration: 'none' }}>Home</a>
    <a href="#about" style={{ color: '#fff', marginRight: '1.5rem', textDecoration: 'none' }}>About</a>
    <a href="#contact" style={{ color: '#fff', textDecoration: 'none' }}>Contact</a>
  </nav>
)

export default Navbar
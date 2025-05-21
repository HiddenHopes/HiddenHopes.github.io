import React from 'react'
import Navbar from './Navbar'

interface HeaderProps {
  isNight: boolean
}

const Header: React.FC<HeaderProps> = ({ isNight }) => (
  <header
    style={{
      width: '100%',
      position: 'fixed',
      top: 0,
      left: 0,
      zIndex: 10,
      background: isNight ? 'rgba(20,30,40,0.95)' : 'rgba(255,255,255,0.95)',
      color: isNight ? '#fff' : '#222',
      boxShadow: isNight
        ? '0 2px 8px rgba(0,0,0,0.1)'
        : '0 2px 8px rgba(0,0,0,0.05)',
      transition: 'background 0.3s, color 0.3s'
    }}
  >
    <Navbar isNight={isNight} />
  </header>
)

export default Header
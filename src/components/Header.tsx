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
      background: isNight
        ? 'linear-gradient(90deg,rgb(28, 89, 158) 0%,rgb(1, 3, 37) 100%)'
        : 'linear-gradient(90deg,rgb(247, 248, 248) 0%,rgb(140, 203, 245) 100%)',
      color: isNight ? '#fff' : '#222',
      boxShadow: isNight
        ? '0 2px 8px rgba(0,0,0,0.15)'
        : '0 2px 8px rgba(0,0,0,0.05)',
      transition: 'background 0.3s, color 0.3s'
    }}
  >
    <Navbar isNight={isNight} />
  </header>
)

export default Header
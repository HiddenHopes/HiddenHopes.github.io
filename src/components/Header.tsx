import React from 'react'
import Navbar from './Navbar'

const Header: React.FC = () => (
  <header style={{ width: '100%', position: 'fixed', top: 0, left: 0, zIndex: 10 }}>
    <Navbar />
  </header>
)

export default Header
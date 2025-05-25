// src/App.tsx
import React, { useState } from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import GameComponent from './components/GameComponent'
import MainBody from './components/MainBody'

function App() {
  const [isNight, setIsNight] = useState(true)
  const [showGameMenu, setShowGameMenu] = useState(false)
  const [showTicTacToe, setShowTicTacToe] = useState(false)
  const [showDrawing, setShowDrawing] = useState(false)
  const handleThemeToggle = () => setIsNight((prev) => !prev)
  const handleGameMenuToggle = () => setShowGameMenu((prev) => !prev)

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        position: 'relative',
        overflow: 'hidden',
        background: isNight
          ? 'radial-gradient(ellipse at 50% 80%,rgb(24, 55, 133) 0%, #090a0f 100%)'
          : 'linear-gradient(to bottom, #e3f6ff 0%, #b3e0ff 100%)'
      }}
    >
      <Header isNight={isNight} onThemeToggle={handleThemeToggle} />
      <GameComponent
        isNight={isNight}
        showGameMenu={showGameMenu}
        onGameMenuToggle={handleGameMenuToggle}
        onTicTacToeClick={() => {
          setShowTicTacToe(!showTicTacToe)
          setShowGameMenu(false)
          setShowDrawing(false)
        }}
        onDrawingClick={() => {
          setShowDrawing(true)
          setShowGameMenu(false)
          setShowTicTacToe(false)
        }}
      />
      {/* Main 3D/Canvas body */}
      <MainBody
        isNight={isNight}
        showTicTacToe={showTicTacToe}
        setShowTicTacToe={setShowTicTacToe}
        showDrawing={showDrawing}
        setShowDrawing={setShowDrawing}
      />
      <Footer isNight={isNight} />
    </div>
  )
}

export default App

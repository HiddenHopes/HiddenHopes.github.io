// src/App.tsx
import React, { useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { Stars, OrbitControls, Sky, Cloud } from '@react-three/drei'
import Moon from './components/Moon'
import WavingFlag from './components/WavingFlag'
import Header from './components/Header'
import Footer from './components/Footer'
import Parachute from './components/Parachute'
import AirBalloon from './components/AirBalloon'
import RealAirBalloon from './components/RealAirBalloon'
import Satellite from './components/Satellite'
import { FaMoon, FaSun } from 'react-icons/fa'

function App() {
  const [isNight, setIsNight] = useState(true)
  const handleThemeToggle = () => setIsNight((prev) => !prev)

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
      <Header isNight={isNight} />
      {/* Animated Theme Toggle Button */}
      <button
        onClick={handleThemeToggle}
        title={`Switch to ${isNight ? 'Day' : 'Night'} mode`}
        className={`theme-toggle-btn ${isNight ? 'night' : 'day'}`}
        style={{
          position: 'fixed',
          top: 80,
          right: 30,
          zIndex: 20,
          width: 56,
          height: 56,
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
          fontSize: '2rem',
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
      <div
        style={{
          width: '100vw',
          height: '100vh',
          background: 'transparent'
        }}
      >
        <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
          {isNight ? (
            <>
              <fog attach="fog" args={['#090a0f', 0, 15]} />
              <Stars
                radius={100}
                depth={50}
                count={5000}
                factor={4}
                saturation={0}
                fade
                speed={1}
              />
              <pointLight
                position={[2, 0, 13]}
                intensity={700}
                color="#ddfbe6"
              />
              <ambientLight intensity={0.1} />
              <Moon textureUrl="/moon-texture.jpg" />
              <Satellite moonPosition={[0, 0, 0]} modelPath="/satellite.glb" />
              <WavingFlag />
            </>
          ) : (
            <>
              <Sky
                sunPosition={[10, 5, 10]}
                distance={1000}
                turbidity={2}
                rayleigh={0.3}
                mieCoefficient={0.005}
                mieDirectionalG={0.7}
              />
              <ambientLight intensity={1.2} />
              <directionalLight
                position={[5, 10, 5]}
                intensity={1.5}
                color="#fffbe6"
              />
              <RealAirBalloon />
            </>
          )}
          <OrbitControls
            enableZoom={true}
            minDistance={2}
            maxDistance={350}
            autoRotate
            autoRotateSpeed={0.1}
          />
        </Canvas>
      </div>
      <Footer isNight={isNight} />
    </div>
  )
}

export default App

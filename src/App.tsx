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
      {/* Theme Toggle Button with Icon and Tooltip */}
      <button
        onClick={handleThemeToggle}
        title={`Switch to ${isNight ? 'Day' : 'Night'} mode`}
        style={{
          position: 'fixed',
          top: 80,
          right: 30,
          zIndex: 20,
          padding: '0.6rem 1rem',
          background: isNight
            ? 'linear-gradient(135deg, #232946 0%, #1b2735 100%)'
            : 'linear-gradient(135deg, #ffe259 0%, #ffa751 100%)',
          color: isNight ? '#ffe259' : '#232946',
          border: 'none',
          borderRadius: '50%',
          cursor: 'pointer',
          boxShadow: isNight
            ? '0 2px 12px rgba(35,41,70,0.25)'
            : '0 2px 12px rgba(255,226,89,0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.5rem',
          transition: 'background 0.3s, color 0.3s'
        }}
      >
        {isNight ? <FaSun /> : <FaMoon />}
      </button>
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
              <WavingFlag />
            </>
          ) : (
            <>
              <Sky
                sunPosition={[10, 5, 10]}  // Increased sun position for brighter sky
                distance={1000}  // Increased distance
                turbidity={2}     // Lower values make the sky clearer
                rayleigh={0.3}      // Higher values make the sky bluer
                mieCoefficient={0.005}
                mieDirectionalG={0.7}
              />
              <ambientLight intensity={1.2} />
              <directionalLight
                position={[5, 10, 5]}
                intensity={1.5}
                color="#fffbe6"
              />
              {/* <Parachute /> */}
              {/* <AirBalloon /> */}
              <RealAirBalloon />
              {/* <Cloud position={[-6, 1.5, -5]} speed={0.2} opacity={0.8} />
              <Cloud position={[1, 2, -5]} speed={0.15} opacity={0.7} />
              <Cloud position={[14, 1, -4]} speed={0.18} opacity={0.75} /> */}
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

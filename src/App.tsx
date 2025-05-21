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
          ? 'radial-gradient(ellipse at bottom, #1b2735 0%, #090a0f 100%)'
          : 'linear-gradient(to bottom, #e3f6ff 0%, #b3e0ff 100%)'
      }}
    >
      <Header isNight={isNight} />
      {/* Theme Toggle Button */}
      <button
        onClick={handleThemeToggle}
        style={{
          position: 'fixed',
          top: 80,
          right: 30,
          zIndex: 20,
          padding: '0.5rem 1rem',
          background: isNight ? '#222' : '#fff',
          color: isNight ? '#fff' : '#222',
          border: '1px solid #ddd',
          borderRadius: 8,
          cursor: 'pointer',
          boxShadow: isNight
            ? '0 2px 8px rgba(0,0,0,0.15)'
            : '0 2px 8px rgba(0,0,0,0.05)'
        }}
      >
        Switch to {isNight ? 'Day' : 'Night'} Mode
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

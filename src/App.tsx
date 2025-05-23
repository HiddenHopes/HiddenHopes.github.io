// src/App.tsx
import React, { useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { Stars, OrbitControls, Sky, Cloud, Sparkles } from '@react-three/drei'
import Moon from './components/Moon'
import WavingFlag from './components/WavingFlag'
import Header from './components/Header'
import Footer from './components/Footer'
import Parachute from './components/Parachute'
import AirBalloon from './components/AirBalloon'
import RealAirBalloon from './components/RealAirBalloon'
import Satellite from './components/Satellite'
import { FaMoon, FaSun } from 'react-icons/fa'
import { FaGamepad } from 'react-icons/fa'
import TicTacToe3D from './components/TicTacToe3D'
import Aurora from './components/Aurora'
import Nebula from './components/Nebula'
import { ShootingStarsField } from './components/ShootingStar'

function App() {
  const [isNight, setIsNight] = useState(true)
  const [showGameMenu, setShowGameMenu] = useState(false)
  const [showTicTacToe, setShowTicTacToe] = useState(false)
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
      <Header isNight={isNight} />
      {/* Game Button */}
      <div style={{ position: 'fixed', top: 80, left: 30, zIndex: 30 }}>
        <button
          onClick={handleGameMenuToggle}
          title="Games"
          className="game-btn"
          style={{
            width: 56,
            height: 56,
            background: isNight
              ? 'linear-gradient(135deg, #232946 0%, #1b2735 100%)'
              : 'linear-gradient(135deg, #ffe259 0%, #ffa751 100%)',
            color: isNight ? '#51ff8b' : '#232946',
            border: 'none',
            borderRadius: '50%',
            cursor: 'pointer',
            boxShadow: isNight
              ? '0 0 16px 4px #23294666, 0 2px 12px #0004'
              : '0 0 16px 4px #ffe25966, 0 2px 12px #ffa75133',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2rem',
            transition: 'background 0.5s, color 0.5s, box-shadow 0.5s'
          }}
        >
          <FaGamepad />
        </button>
        <style>
          {`
            .game-btn:hover {
              background: linear-gradient(135deg, #51ff8b 0%, #1b2735 100%, #00c3ff 100%);
              color: #fff;
              box-shadow: 0 0 32px 8px #51ff8bcc, 0 4px 24px #232946cc;
            }
          `}
        </style>
        {showGameMenu && (
          <div
            style={{
              position: 'absolute',
              top: 64,
              left: 0,
              minWidth: 180,
              background: isNight
                ? 'linear-gradient(135deg, #232946 0%, #1b2735 100%)'
                : 'linear-gradient(135deg, #fffbe6 0%, #b3e0ff 100%)',
              color: isNight ? '#fff' : '#232946',
              borderRadius: 12,
              boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
              padding: '0.5rem 0',
              zIndex: 40,
              animation: 'fadeInMenu 0.3s'
            }}
          >
            <div style={{ padding: '0.7rem 1.2rem', cursor: 'pointer', fontWeight: 500, transition: 'background 0.2s' }}
              onClick={() => {
                setShowTicTacToe(!showTicTacToe)
                setShowGameMenu(false)
              }}
              onMouseOver={e => (e.currentTarget.style.background = isNight ? '#1b2735' : '#e3f6ff')}
              onMouseOut={e => (e.currentTarget.style.background = 'transparent')}
            >
              🎮 TicTacToe
            </div>
            <div style={{ padding: '0.7rem 1.2rem', cursor: 'pointer', fontWeight: 500, transition: 'background 0.2s' }}
              onClick={() => alert('Cricket coming soon!')}
              onMouseOver={e => (e.currentTarget.style.background = isNight ? '#1b2735' : '#e3f6ff')}
              onMouseOut={e => (e.currentTarget.style.background = 'transparent')}
            >
              🏏 Cricket
            </div>
            <div style={{ padding: '0.7rem 1.2rem', cursor: 'pointer', fontWeight: 500, transition: 'background 0.2s' }}
              onClick={() => alert('Football coming soon!')}
              onMouseOver={e => (e.currentTarget.style.background = isNight ? '#1b2735' : '#e3f6ff')}
              onMouseOut={e => (e.currentTarget.style.background = 'transparent')}
            >
              ⚽ Football
            </div>
          </div>
        )}
        <style>
          {`
            @keyframes fadeInMenu {
              from { opacity: 0; transform: translateY(-10px);}
              to { opacity: 1; transform: translateY(0);}
            }
          `}
        </style>
      </div>
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
              {/* Show 3D TicTacToe board in the world */}
              {!showTicTacToe && (
                <>
                  <Moon textureUrl="/moon-texture.jpg" />
                  <Satellite moonPosition={[0, 0, 0]} modelPath="/satellite.glb" />
                  <WavingFlag />
                  <Sparkles count={30} scale={10} size={2} color="#fffbe6" speed={0.5} />
                  {/* Nebulae */}
                  <Nebula position={[-3, 2, -10]} color1="#8ef6e4" color2="#a084ee" />
                  {/* <Nebula position={[3, 1.5, -12]} color1="#fcb1b1" color2="#f7d060" opacity={0.35} scale={[6,2.5,1]} /> */}
                  {/* Shooting Stars */}
                  {/* <ShootingStarsField count={2} /> */}
                </>
              )}
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
              {!showTicTacToe &&
                <RealAirBalloon />
              }
            </>
          )}
          {
            showTicTacToe &&
            <group position={[0, 0, 0]}>
              <TicTacToe3D onClose={() => setShowTicTacToe(false)} />
            </group>
          }
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

import React from 'react'
import { Canvas } from '@react-three/fiber'
import { Stars, OrbitControls, Sky, Sparkles } from '@react-three/drei'
import Moon from './Moon'
import WavingFlag from './WavingFlag'
import Parachute from './Parachute'
import AirBalloon from './AirBalloon'
import RealAirBalloon from './RealAirBalloon'
import Satellite from './Satellite'
import TicTacToe3D from './TicTacToe3D'
import Aurora from './Aurora'
import Nebula from './Nebula'
import { ShootingStarsField } from './ShootingStar'

interface MainBodyProps {
  isNight: boolean
  showTicTacToe: boolean
  setShowTicTacToe: (show: boolean) => void
}

const MainBody: React.FC<MainBodyProps> = ({ isNight, showTicTacToe, setShowTicTacToe }) => {
  return (
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
  )
}

export default MainBody

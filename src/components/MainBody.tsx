import React from 'react'
import { useTranslation } from 'react-i18next'
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
import Drawing from './Drawing'
import FootballPenalty3D from './FootballPenalty3D'

interface MainBodyProps {
  isNight: boolean
  showTicTacToe: boolean
  setShowTicTacToe: (show: boolean) => void
  showDrawing?: boolean
  setShowDrawing?: (show: boolean) => void
  showFootball?: boolean
  setShowFootball?: (show: boolean) => void
}

const MainBody: React.FC<MainBodyProps> = ({ isNight, showTicTacToe, setShowTicTacToe, showDrawing, setShowDrawing, showFootball, setShowFootball }) => {
  const { t } = useTranslation();
  // If showDrawing/setShowDrawing are not provided, fallback to local state (for backward compatibility)
  const [internalShowDrawing, internalSetShowDrawing] = React.useState(false)
  const drawingOpen = showDrawing !== undefined ? showDrawing : internalShowDrawing
  const setDrawingOpen = setShowDrawing || internalSetShowDrawing
  React.useEffect(() => { if (showTicTacToe) setDrawingOpen(false) }, [showTicTacToe])
  // Expose setShowDrawing to window for quick test (remove in prod)
  // @ts-ignore
  window.setShowDrawing = setShowDrawing

  const [internalShowFootball, internalSetShowFootball] = React.useState(false)
  const footballOpen = showFootball !== undefined ? showFootball : internalShowFootball
  const setFootballOpen = setShowFootball || internalSetShowFootball
  React.useEffect(() => { if (showTicTacToe || drawingOpen) setFootballOpen(false) }, [showTicTacToe, drawingOpen])

  // Canvas key to force remount on theme change
  const [canvasKey, setCanvasKey] = React.useState(0);
  React.useEffect(() => { setCanvasKey(k => k + 1); }, [isNight]);

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        background: 'transparent'
      }}
    >
      <Canvas key={canvasKey} camera={{ position: [0, 0, 5], fov: 75 }}>
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
            <ambientLight intensity={0.2} />
            {/* Show 3D TicTacToe board in the world */}
            {!showTicTacToe && !showFootball && (
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
        {
          footballOpen &&
          <group position={[0, -1.2, 0]}>
            <FootballPenalty3D onClose={() => setFootballOpen(false)} />
          </group>
        }
        <OrbitControls
          enableZoom={true}
          minDistance={2}
          maxDistance={8}
          autoRotate
          autoRotateSpeed={0.1}
        />
      </Canvas>
      {/* Drawing overlay window, shown if drawingOpen is true */}
      {drawingOpen && (
        <div style={{ position: 'fixed', top: 120, right: 440, zIndex: 100 }}>
          <Drawing width={840} height={520} />
          <button
            onClick={() => setDrawingOpen(false)}
            style={{
              position: 'absolute', top: 0, right: 0, zIndex: 101,
              background: '#232946', color: '#fff', border: 'none', borderRadius: 16,
              width: 32, height: 32, fontSize: 20, fontWeight: 700, cursor: 'pointer',
              boxShadow: '0 2px 8px #0004'
            }}
            aria-label={t('aria_labels.close_drawing')}
          >×</button>
        </div>
      )}
    </div>
  )
}

export default MainBody

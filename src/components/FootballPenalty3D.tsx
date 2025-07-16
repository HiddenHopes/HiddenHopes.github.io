import React, { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useFrame, useLoader } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'

const GOAL_WIDTH = 3
const GOAL_HEIGHT = 1.2
const GOAL_DEPTH = 0.2

type Direction = 'left' | 'center' | 'right'

function getRandomDirection(): Direction {
  const dirs: Direction[] = ['left', 'center', 'right']
  return dirs[Math.floor(Math.random() * dirs.length)]
}

const FootballPenalty3D: React.FC<{ onClose?: () => void }> = ({ onClose }) => {
  const { t } = useTranslation();
  const ballRef = useRef<THREE.Mesh>(null)
  const keeperRef = useRef<THREE.Mesh>(null)
  const [shooting, setShooting] = useState(false)
  const [result, setResult] = useState<null | 'goal' | 'saved'>(null)
  const [aim, setAim] = useState<Direction>('center')
  const [keeperDir, setKeeperDir] = useState<Direction>('center')
  const [ballPos, setBallPos] = useState([0, 0.15, 2.5])
  const [ballTarget, setBallTarget] = useState<[number, number, number]>([0, 0.15, -GOAL_DEPTH])
  const [anim, setAnim] = useState(0)
  const footballTexture = useLoader(THREE.TextureLoader, '/football-texture.jpg')
  const fieldTexture = useLoader(THREE.TextureLoader, '/field-textur.jpg')

  // Animate ball and keeper
  useFrame(() => {
    if (shooting && anim < 1) {
      setAnim(a => Math.min(1, a + 0.04))
      // Ball animation
      const [bx, by, bz] = ballPos
      const [tx, ty, tz] = ballTarget
      if (ballRef.current) {
        ballRef.current.position.set(
          bx + (tx - bx) * anim,
          by + (ty - by) * anim,
          bz + (tz - bz) * anim
        )
      }
      // Keeper animation
      if (keeperRef.current) {
        let kx = 0
        if (keeperDir === 'left') kx = -GOAL_WIDTH / 3
        if (keeperDir === 'right') kx = GOAL_WIDTH / 3
        keeperRef.current.position.x = kx * anim
      }
      // End of animation
      if (anim >= 1) {
        // Determine result
        let goal = true
        if (aim === keeperDir) goal = false
        setResult(goal ? 'goal' : 'saved')
        setTimeout(() => setShooting(false), 1200)
      }
    }
  })

  // Handle shoot
  function handleShoot(dir: Direction) {
    if (shooting) return
    setAim(dir)
    setKeeperDir(getRandomDirection())
    setAnim(0)
    setResult(null)
    setShooting(true)
    // Set ball target based on aim
    let x = 0
    if (dir === 'left') x = -GOAL_WIDTH / 3
    if (dir === 'right') x = GOAL_WIDTH / 3
    setBallTarget([x, 0.15, -GOAL_DEPTH])
    // Reset ball and keeper
    if (ballRef.current) ballRef.current.position.set(0, 0.15, 2.5)
    if (keeperRef.current) keeperRef.current.position.set(0, 0.6, -GOAL_DEPTH)
  }

  // Reset for next shot
  function handleRestart() {
    setShooting(false)
    setResult(null)
    setAim('center')
    setKeeperDir('center')
    setAnim(0)
    setBallTarget([0, 0.15, -GOAL_DEPTH])
    if (ballRef.current) ballRef.current.position.set(0, 0.15, 2.5)
    if (keeperRef.current) keeperRef.current.position.set(0, 0.6, -GOAL_DEPTH)
  }

  return (
    <group>
      {/* Ground */}
      <mesh position={[0, 0, 8]}>
        <boxGeometry args={[12.5, 0.1, 18]} />
        <meshStandardMaterial map={fieldTexture} />
      </mesh>
      {/* Goal */}
      <mesh position={[0, GOAL_HEIGHT / 2, -GOAL_DEPTH]}>
        <boxGeometry args={[GOAL_WIDTH, GOAL_HEIGHT, 0.05]} />
        <meshStandardMaterial color="#fff" opacity={0.7} transparent />
      </mesh>
      {/* Ball */}
      <mesh ref={ballRef} position={[0, 0.15, 2.1]} castShadow>
        <sphereGeometry args={[0.1, 32, 32]} />
        <meshStandardMaterial map={footballTexture} />
      </mesh>
      {/* Keeper */}
      <mesh ref={keeperRef} position={[0, 0.6, -GOAL_DEPTH]} castShadow>
        <boxGeometry args={[0.5, 1.2, 0.2]} />
        <meshStandardMaterial color="#1976d2" />
      </mesh>
      {/* UI */}
      <pointLight position={[-5, 4.5, 0.5]} intensity={80} color="#ffffff" />
      <Html position={[0, 3, 1.5]} center style={{ pointerEvents: 'auto', textAlign: 'center' }}>
        <div style={{ background: 'rgba(30,30,30,0.85)', color: '#fff', borderRadius: 12, padding: 16, minWidth: 220, boxShadow: '0 2px 12px #0006', position: 'relative' }}>
          {onClose && (
            <button
              onClick={onClose}
              style={{
                position: 'absolute', top: 8, right: 8, background: 'transparent', border: 'none',
                color: '#fff', fontSize: 22, cursor: 'pointer', fontWeight: 700
              }}
              aria-label={t('aria_labels.close')}
            >×</button>
          )}
          <h3 style={{ margin: '0 0 10px 0' }}>{t('game.penalty_shootout')}</h3>
          <div>
            <button onClick={() => handleShoot('left')} disabled={shooting} style={{ margin: 8, fontSize: 18, padding: '8px 18px', borderRadius: 8, cursor: 'pointer' }}>{t('game.left')}</button>
            <button onClick={() => handleShoot('center')} disabled={shooting} style={{ margin: 8, fontSize: 18, padding: '8px 18px', borderRadius: 8, cursor: 'pointer' }}>{t('game.center')}</button>
            <button onClick={() => handleShoot('right')} disabled={shooting} style={{ margin: 8, fontSize: 18, padding: '8px 18px', borderRadius: 8, cursor: 'pointer' }}>{t('game.right')}</button>
          </div>
          {result && (
            <div style={{ fontSize: 22, marginTop: 10, fontWeight: 600 }}>
              {result === 'goal' ? t('game.goal') : t('game.saved')}
            </div>
          )}
          <button onClick={handleRestart} style={{ marginTop: 14, fontSize: 16, padding: '6px 18px', borderRadius: 8, cursor: 'pointer' }}>{t('game.restart')}</button>
        </div>
      </Html>
    </group>
  )
}

export default FootballPenalty3D

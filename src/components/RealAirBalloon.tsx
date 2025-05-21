import React, { useRef, useEffect, useState } from 'react'
import { useFrame, useLoader } from '@react-three/fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import * as THREE from 'three'

const BALLOON_MODELS = [
  '/balloon1.glb',
  '/balloon2.glb'
]

// Standard R3F way to preload:
BALLOON_MODELS.forEach((model) => {
  useLoader.preload(GLTFLoader, model)
})

function getRandomFromArray<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

interface BalloonInstance {
  id: number
  x: number
  z: number
  speed: number
  model: string
}

const NUM_BALLOONS = 3
const X_RANGE = 10 // wider range for x
const Z_RANGE = 8  // wider range for z
const MIN_DIST = 2 // minimum distance between balloons

function generateBalloonPositions(num: number) {
  const balloons: BalloonInstance[] = []
  let attempts = 0
  while (balloons.length < num && attempts < 100) {
    const x = Math.random() * X_RANGE - X_RANGE / 2
    const z = Math.random() * -Z_RANGE - 2
    const tooClose = balloons.some(b => Math.hypot(b.x - x, b.z - z) < MIN_DIST)
    if (!tooClose) {
      balloons.push({
        id: balloons.length,
        x,
        z,
        speed: 0.1 + Math.random() * 0.1,
        model: getRandomFromArray(BALLOON_MODELS)
      })
    }
    attempts++
  }
  return balloons
}

const RealAirBalloon: React.FC = () => {
  // Randomly generate balloon instances
  const [balloons] = useState<BalloonInstance[]>(() => generateBalloonPositions(NUM_BALLOONS))

  return (
    <>
      {balloons.map(balloon => (
        <SingleBalloon
          key={balloon.id}
          x={balloon.x}
          z={balloon.z}
          speed={balloon.speed}
          model={balloon.model}
        />
      ))}
    </>
  )
}

interface SingleBalloonProps {
  x: number
  z: number
  speed: number
  model: string
}

const SingleBalloon: React.FC<SingleBalloonProps> = ({ x, z, speed, model }) => {
  const ref = useRef<THREE.Group>(null)
  const gltf = useLoader(GLTFLoader, model)
  const [y, setY] = useState(() => 2 + Math.random() * 2) // start between y=2 and y=4

  useFrame((state, delta) => {
    if (ref.current) {
      // Float up and down gently
      const t = state.clock.getElapsedTime()
      ref.current.position.y = y + Math.sin(t * 0.5 + x) * 0.2
      // Drift horizontally
      ref.current.position.x = x + Math.sin(t * 0.1 + z) * 0.5
      // Optionally, you can make it fall slowly (uncomment below for falling effect)
      // ref.current.position.y -= speed * delta * 0.2
      // if (ref.current.position.y < -2) ref.current.position.y = 4
    }
  })

  return (
    <group ref={ref} position={[x, y, z]} scale={[0.1, 0.1, 0.1]}>
      <primitive object={gltf.scene} />
    </group>
  )
}

export default RealAirBalloon
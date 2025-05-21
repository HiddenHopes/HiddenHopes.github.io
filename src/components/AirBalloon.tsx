import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const AirBalloon: React.FC = () => {
  const group = useRef<THREE.Group>(null)

  useFrame(({ clock }) => {
    if (group.current) {
      group.current.position.y = 1.5 + Math.sin(clock.getElapsedTime() * 0.3) * 0.5
      group.current.position.x = -2 + Math.sin(clock.getElapsedTime() * 0.1)
    }
  })

  return (
    <group ref={group} position={[-2, 1.5, -3]}>
      {/* Balloon */}
      <mesh>
        <sphereGeometry args={[0.25, 32, 32]} />
        <meshStandardMaterial color="#ff9800" />
      </mesh>
      {/* Balloon stripes */}
      <mesh>
        <torusGeometry args={[0.25, 0.01, 16, 100]} />
        <meshStandardMaterial color="#fff" />
      </mesh>
      {/* Basket */}
      <mesh position={[0, -0.35, 0]}>
        <cylinderGeometry args={[0.07, 0.07, 0.1, 16]} />
        <meshStandardMaterial color="#795548" />
      </mesh>
      {/* Strings */}
      {[...Array(4)].map((_, i) => (
        <mesh key={i} position={[Math.cos(i * Math.PI / 2) * 0.07, -0.2, Math.sin(i * Math.PI / 2) * 0.07]}>
          <cylinderGeometry args={[0.005, 0.005, 0.15, 8]} />
          <meshStandardMaterial color="#888" />
        </mesh>
      ))}
    </group>
  )
}

export default AirBalloon
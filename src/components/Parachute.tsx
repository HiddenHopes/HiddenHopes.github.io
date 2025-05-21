import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const Parachute: React.FC = () => {
  const group = useRef<THREE.Group>(null)

  useFrame(({ clock }) => {
    if (group.current) {
      group.current.position.y = 3 - ((clock.getElapsedTime() * 0.3) % 5)
    }
  })

  return (
    <group ref={group} position={[1, 3, -2]}>
      {/* Parachute canopy */}
      <mesh position={[0, 0.2, 0]}>
        <sphereGeometry args={[0.25, 32, 16, 0, Math.PI]} />
        <meshStandardMaterial color="#ff6384" />
      </mesh>
      {/* Parachute stripes */}
      <mesh position={[0, 0.22, 0]}>
        <torusGeometry args={[0.22, 0.01, 16, 100, Math.PI]} />
        <meshStandardMaterial color="#fff" />
      </mesh>
      {/* Parachute strings */}
      {[...Array(4)].map((_, i) => (
        <mesh key={i} position={[Math.cos(i * Math.PI / 2) * 0.18, 0, Math.sin(i * Math.PI / 2) * 0.18]}>
          <cylinderGeometry args={[0.005, 0.005, 0.2, 8]} />
          <meshStandardMaterial color="#888" />
        </mesh>
      ))}
      {/* Person */}
      <mesh position={[0, -0.15, 0]}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshStandardMaterial color="#ffe0b2" />
      </mesh>
      <mesh position={[0, -0.28, 0]}>
        <cylinderGeometry args={[0.025, 0.025, 0.15, 8]} />
        <meshStandardMaterial color="#1976d2" />
      </mesh>
    </group>
  )
}

export default Parachute
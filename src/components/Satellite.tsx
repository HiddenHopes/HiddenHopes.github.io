import React, { useRef } from 'react'
import { useFrame, useLoader } from '@react-three/fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import * as THREE from 'three'

interface SatelliteProps {
  moonPosition?: [number, number, number]
  radius?: number // orbit radius
  speed?: number  // orbit speed
  modelPath?: string // path to satellite glb
}

const DEFAULT_MOON_POS: [number, number, number] = [0, 0, 0]

const Satellite: React.FC<SatelliteProps> = ({
  moonPosition = DEFAULT_MOON_POS,
  radius = 5.5,
  speed = 0.5,
  modelPath = '/satellite.glb'
}) => {
  const group = useRef<THREE.Group>(null)
  const gltf = useLoader(GLTFLoader, modelPath)

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * speed
    if (group.current) {
      // Circular orbit in XZ plane around the moon
      group.current.position.x = moonPosition[0] + Math.cos(t) * radius
      group.current.position.y = moonPosition[1] + 0.2 * Math.sin(t * 2) // slight up/down
      group.current.position.z = moonPosition[2] + Math.sin(t) * radius
      group.current.rotation.y = t + Math.PI // rotate satellite for realism
    }
  })

  return (
    <group ref={group}>
      <primitive object={gltf.scene} scale={0.05} />
    </group>
  )
}

export default Satellite
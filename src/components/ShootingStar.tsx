import React, { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// ShootingStar: a fast-moving glowing streak across the sky
const getRandom = (min: number, max: number) => Math.random() * (max - min) + min

const ShootingStar: React.FC<{
  startDelay?: number // seconds before shooting star appears
  duration?: number // seconds for the streak
  startPos?: [number, number, number]
  endPos?: [number, number, number]
}> = ({
  startDelay = 0,
  duration = 10,
  startPos = [getRandom(-6, 6), getRandom(2, 5), getRandom(-12, -8)],
  endPos = [getRandom(-6, 6), getRandom(2, 5), getRandom(-12, -8)]
}) => {
  const group = useRef<THREE.Group>(null)
  const [visible, setVisible] = useState(false)
  const [startTime] = useState(() => performance.now() / 1000 + startDelay)

  useFrame(() => {
    const now = performance.now() / 1000
    const t = now - startTime
    if (t > 0 && t < duration) {
      setVisible(true)
      // Linear interpolation between start and end
      const alpha = t / duration
      if (group.current) {
        group.current.position.set(
          startPos[0] + (endPos[0] - startPos[0]) * alpha,
          startPos[1] + (endPos[1] - startPos[1]) * alpha,
          startPos[2] + (endPos[2] - startPos[2]) * alpha
        )
      }
    } else if (t >= duration) {
      setVisible(false)
    }
  })

  // Calculate direction for the streak
  const dx = endPos[0] - startPos[0]
  const dy = endPos[1] - startPos[1]
  const dz = endPos[2] - startPos[2]
  const length = Math.sqrt(dx * dx + dy * dy + dz * dz)
  const angle = Math.atan2(dy, dx)

  // Fade tail effect: gradient alpha along the streak
  const tailMaterial = new THREE.MeshBasicMaterial({
    color: new THREE.Color('#fffbe6'),
    transparent: true,
    opacity: 0.0,
    blending: THREE.AdditiveBlending
  })

  return (
    <group ref={group} visible={visible} rotation={[0, 0, angle]}>
      {/* Glowing streak with fading tail using a custom shader */}
      <mesh>
        <planeGeometry args={[length, 0.09]} />
        <shaderMaterial
          transparent
          blending={THREE.AdditiveBlending}
          vertexShader={`
            varying vec2 vUv;
            void main() {
              vUv = uv;
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
          `}
          fragmentShader={`
            varying vec2 vUv;
            void main() {
              float alpha = smoothstep(1.0, 0.0, vUv.x) * 0.8;
              gl_FragColor = vec4(1.0, 0.98, 0.8, alpha);
            }
          `}
        />
      </mesh>
      {/* Glowing head */}
      <mesh position={[length / 2, 0, 0]}>
        <sphereGeometry args={[0.09, 16, 16]} />
        <meshBasicMaterial
          color="#fffbe6"
          transparent
          opacity={1}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  )
}

// ShootingStarsField: spawns multiple shooting stars at random intervals
export const ShootingStarsField: React.FC<{ count?: number }> = ({ count = 2 }) => {
  // Each star gets a random delay and random path
  return (
    <group>
      {Array.from({ length: count }).map((_, i) => (
        <ShootingStar
          key={i}
          startDelay={getRandom(i * 2, i * 2 + 6)}
          duration={getRandom(0.8, 1.5)}
          startPos={[getRandom(-6, 6), getRandom(2, 5), getRandom(-12, -8)]}
          endPos={[getRandom(-6, 6), getRandom(2, 5), getRandom(-12, -8)]}
        />
      ))}
    </group>
  )
}

export default ShootingStar

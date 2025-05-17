// src/App.tsx
import React, { useRef } from 'react'
import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import { Stars, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'

function WavingFlag() {
  const mesh = useRef<THREE.Mesh>(null)
  const texture = useLoader(THREE.TextureLoader, '/bangladesh-flag.png') // Place image in public/

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    if (mesh.current) {
      const geometry = mesh.current.geometry as THREE.PlaneGeometry
      const position = geometry.attributes.position
      for (let i = 0; i < position.count; i+=1) {
        const x = position.getX(i)
        const y = position.getY(i)
        // Waving effect: amplitude increases with y (top of flag waves more)
        const wave = Math.sin(x * 30 + t * 4) * 0.01 * (y + 1)
        position.setZ(i, wave)
      }
      position.needsUpdate = true
      // geometry.computeVertexNormals()
    }
  })

  return (
    <group position={[0.045, 0.07, 0]}>
      <mesh ref={mesh} position={[0, 0, 0]}>
      <planeGeometry args={[0.08, 0.05, 16, 8]} />
      <meshStandardMaterial map={texture}
        side={THREE.DoubleSide}
        transparent={false} />
    </mesh>
      {/* Red circle on flag */}
          {/* <mesh position={[0, 0, 0.001]}>
            <circleGeometry args={[0.015, 32]} />
            <meshStandardMaterial color="#f42a41" />
          </mesh> */}
    </group>
    
  )
}

function App() {
  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        background: 'radial-gradient(ellipse at bottom, #1b2735 0%, #090a0f 100%)',
      }}
    >
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        <fog attach="fog" args={['#090a0f', 10, 50]} />
        <Stars
          radius={100}
          depth={50}
          count={5000}
          factor={4}
          saturation={0}
          fade
          speed={1}
        />
        {/* Sun (light source) placed to the left */}
        <pointLight position={[10, 0, 10]} intensity={500} color="#ddfbe6" />
        {/* Optional: faint ambient light for soft shadows */}
        <ambientLight intensity={0.1} />
        {/* Moon: will show light on one side, shadow on the other */}
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[1, 64, 64]} />
          <meshStandardMaterial color="#cccccc" roughness={1} metalness={0.2} />
        </mesh>
        {/* Bangladesh flag on the moon */}
        <group position={[0.2, 1.01, 0]}>
          {/* Flag pole */}
          <mesh>
            <boxGeometry args={[0.01, 0.2, 0.01]} />
            <meshStandardMaterial color="#888888" />
          </mesh>
          {/* Flag */}
          <WavingFlag />
        </group>
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

export default App

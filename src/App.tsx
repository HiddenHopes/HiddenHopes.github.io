// src/App.tsx
import React from 'react'
import { Canvas } from '@react-three/fiber'
import { Stars, OrbitControls } from '@react-three/drei'
import Moon from './components/Moon'
import WavingFlag from './components/WavingFlag'

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
        <pointLight position={[2, 0, 13]} intensity={700} color="#ddfbe6" />
        <ambientLight intensity={0.1} />
        <Moon textureUrl="/moon-texture.jpg" />
        <WavingFlag />
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

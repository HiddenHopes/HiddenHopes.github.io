// src/App.tsx
import React from 'react'
import { Canvas } from '@react-three/fiber'
import { Stars, OrbitControls } from '@react-three/drei'

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
        <OrbitControls enableZoom={true} autoRotate autoRotateSpeed={0.1} />
      </Canvas>
    </div>
  )
}

export default App

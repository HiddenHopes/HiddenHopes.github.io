// src/App.tsx
import React from 'react'
import { Canvas } from '@react-three/fiber'
import { Stars, OrbitControls } from '@react-three/drei'

function App() {
  return (
    <div style={{ width: '100vw', height: '100vh', background: 'black' }}>
      <Canvas camera={{ position: [0, 0, 1] }}>
        <Stars
          radius={100}     // Radius of the inner sphere
          depth={50}       // Depth of area where stars are scattered
          count={5000}     // Number of stars
          factor={4}       // Size factor
          saturation={0}   // Color saturation
          fade             // Makes stars fade into background
          speed={1}        // Speed of star movement
        />
        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
      </Canvas>
    </div>
  )
}

export default App

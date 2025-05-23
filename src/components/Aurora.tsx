import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const Aurora: React.FC<{ position?: [number, number, number], scale?: [number, number, number] }> = ({
  position = [0, 3, -6],
  scale = [7, 2, 1]
}) => {
  const mesh = useRef<THREE.Mesh>(null)
  const material = useRef<THREE.ShaderMaterial>(null)

  useFrame(({ clock }) => {
    if (material.current) {
      material.current.uniforms.uTime.value = clock.getElapsedTime()
    }
  })

  return (
    <mesh ref={mesh} position={position} scale={scale}>
      <planeGeometry args={[1, 1, 64, 64]} />
      <shaderMaterial
        ref={material}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        uniforms={{
          uTime: { value: 0 },
        }}
        vertexShader={`
          varying vec2 vUv;
          void main() {
            vUv = uv;
            vec3 pos = position;
            pos.y += 0.08 * sin(uv.x * 12.0 + uv.y * 2.0 + uv.x * 2.0);
            pos.z += 0.18 * sin(uv.x * 8.0 + uv.y * 4.0);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
          }
        `}
        fragmentShader={`
          uniform float uTime;
          varying vec2 vUv;
          void main() {
            float fade = smoothstep(0.0, 0.2, vUv.y) * (1.0 - smoothstep(0.7, 1.0, vUv.y));
            float wave = 0.5 + 0.5 * sin(uTime * 0.7 + vUv.x * 8.0);
            float green = 0.7 + 0.3 * wave;
            float blue = 0.7 + 0.3 * sin(uTime * 0.5 + vUv.x * 6.0);
            float alpha = fade * (0.7 + 0.3 * wave);
            gl_FragColor = vec4(0.2, green, blue, alpha * 0.7);
          }
        `}
      />
    </mesh>
  )
}

export default Aurora
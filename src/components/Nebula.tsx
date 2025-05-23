import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const Nebula: React.FC<{
  position?: [number, number, number]
  scale?: [number, number, number]
  color1?: string
  color2?: string
  opacity?: number
}> = ({
  position = [-3, 2, -10],
  scale = [100, 15, 20],
  color1 = '#8ef6e4',
  color2 = '#a084ee',
  opacity = 0.45
}) => {
  const material = useRef<THREE.ShaderMaterial>(null)

  useFrame(({ clock }) => {
    if (material.current) {
      material.current.uniforms.uTime.value = clock.getElapsedTime()
    }
  })

  return (
    <mesh position={position} scale={scale}>
      <planeGeometry args={[1, 1, 64, 64]} />
      <shaderMaterial
        ref={material}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        uniforms={{
          uTime: { value: 0 },
          uColor1: { value: new THREE.Color(color1) },
          uColor2: { value: new THREE.Color(color2) },
          uOpacity: { value: opacity }
        }}
        vertexShader={`
          varying vec2 vUv;
          void main() {
            vUv = uv;
            vec3 pos = position;
            pos.z += 0.15 * sin(uv.x * 8.0 + uv.y * 4.0);
            pos.y += 0.08 * sin(uv.x * 12.0 + uv.y * 2.0);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
          }
        `}
        fragmentShader={`
          uniform float uTime;
          uniform vec3 uColor1;
          uniform vec3 uColor2;
          uniform float uOpacity;
          varying vec2 vUv;
          void main() {
            float noise = 0.5 + 0.5 * sin(uTime * 0.2 + vUv.x * 8.0 + vUv.y * 6.0);
            float fade = smoothstep(0.0, 0.2, vUv.y) * (1.0 - smoothstep(0.7, 1.0, vUv.y));
            vec3 color = mix(uColor1, uColor2, vUv.x + 0.2 * noise);
            float alpha = fade * noise * uOpacity;
            gl_FragColor = vec4(color, alpha);
          }
        `}
      />
    </mesh>
  )
}

export default Nebula
import React, { useRef } from 'react'
import { useFrame, useLoader } from '@react-three/fiber'
import * as THREE from 'three'

const WavingFlag: React.FC = () => {
    const mesh = useRef<THREE.Mesh>(null)
    const texture = useLoader(THREE.TextureLoader, '/bangladesh-flag.png')

    useFrame(({ clock }) => {
        const t = clock.getElapsedTime()
        if (mesh.current) {
            const geometry = mesh.current.geometry as THREE.PlaneGeometry
            const position = geometry.attributes.position
            for (let i = 0; i < position.count; i += 1) {
                const x = position.getX(i)
                const y = position.getY(i)
                const wave = Math.sin(x * 30 + t * 4) * 0.01 * (y + 1)
                position.setZ(i, wave)
            }
            position.needsUpdate = true
        }
    })

    return (
        <group position={[0.2, 1.01, 0]}>
            {/* Flag pole */}
            <mesh>
                <boxGeometry args={[0.01, 0.2, 0.01]} />
                <meshStandardMaterial color="#888888" />
            </mesh>
            {/* Flag */}
            <mesh ref={mesh} position={[0.045, 0.07, 0]}>
                <planeGeometry args={[0.08, 0.05, 16, 8]} />
                <meshStandardMaterial
                    map={texture}
                    side={THREE.DoubleSide}
                    transparent={false}
                />
            </mesh>
        </group>
    )
}

export default WavingFlag
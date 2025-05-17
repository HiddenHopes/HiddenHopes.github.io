import React from 'react'
import { useLoader } from '@react-three/fiber'
import * as THREE from 'three'

interface MoonProps {
    textureUrl: string
}

const Moon: React.FC<MoonProps> = ({ textureUrl }) => {
    const moonTexture = useLoader(THREE.TextureLoader, textureUrl)
    return (
        <mesh position={[0, 0, 0]}>
            <sphereGeometry args={[1, 64, 64]} />
            <meshStandardMaterial
                map={moonTexture}
                roughness={1}
                metalness={0.2}
            />
        </mesh>
    )
}

export default Moon
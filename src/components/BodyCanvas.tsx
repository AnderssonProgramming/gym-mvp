/* eslint-disable @typescript-eslint/no-explicit-any */
// components/BodyCanvas.tsx
import React from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, useGLTF } from '@react-three/drei'

interface BodyCanvasProps {
  modelPath: string
  onSelectPart: (part: string) => void
}

function Model({ modelPath, onSelectPart }: BodyCanvasProps) {
  const { scene, nodes } = useGLTF(modelPath)
  return (
    <primitive object={scene}>
      {Object.values(nodes)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .filter((n: any) => n.isMesh)
        .map((mesh: any) => (
          <mesh
            key={mesh.name}
            geometry={mesh.geometry}
            material={mesh.material}
            onClick={() => onSelectPart(mesh.name)}
            castShadow
          />
      ))}
    </primitive>
  )
}

export default function BodyCanvas({ modelPath, onSelectPart }: BodyCanvasProps) {
  return (
    <Canvas shadows camera={{ position: [0, 1.5, 3], fov: 50 }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} />
      <Model modelPath={modelPath} onSelectPart={onSelectPart} />
      <OrbitControls enablePan={false} />
    </Canvas>
  )
}

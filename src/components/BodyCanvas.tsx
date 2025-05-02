/* eslint-disable @typescript-eslint/no-explicit-any */
/* components/BodyCanvas.tsx */
'use client'

import React, { useRef, useState, useEffect } from 'react'
import { Canvas, useFrame, extend } from '@react-three/fiber'
import { OrbitControls, useGLTF} from '@react-three/drei'
import * as THREE from 'three'
import ExerciseList from './ExerciseList'

// Only extend specific THREE objects that you need to use as JSX elements
extend({
  Vector3: THREE.Vector3,
  Box3: THREE.Box3
})

interface BodyCanvasProps {
  modelPath: string
  onSelectZone: (zone: number) => void
}

interface Exercise {
  name: string
  sets: number
  reps: number
  videoUrl?: string
  imageUrl?: string
}

// Mock data for testing
const mockExercises: Record<string, Exercise[]> = {
  chest: [
    { name: "Press de Banca", sets: 4, reps: 12, videoUrl: "https://www.youtube.com/watch?v=SCVCLChPQFY&pp=ygULcHJlc3MgYmFuY2HSBwkJhAkBhyohjO8%3D" },
    { name: "Aperturas con Mancuernas", sets: 3, reps: 15, imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTrabpVzpblaU1F6moowgaOi-fRtRtHqJX7cw&s" },
    { name: "Fondos en Paralelas", sets: 3, reps: 10 }
  ],
  back: [
    { name: "Dominadas", sets: 4, reps: 8, videoUrl: "https://www.youtube.com/watch?v=vnpFhruEmsc&pp=ygUJZG9taW5hZGFz" },
    { name: "Remo con Barra", sets: 3, reps: 12, imageUrl: "https://i.pinimg.com/736x/25/9d/02/259d026a07562252c65bcd0d74199704.jpg" },
    { name: "Pulldown en Polea", sets: 3, reps: 12 }
  ],
  biceps: [
    { name: "Curl con Barra", sets: 4, reps: 12, videoUrl: "https://www.youtube.com/watch?v=mFgTFstIfFs&pp=ygUOY3VybCBjb24gYmFycmE%3D" },
    { name: "Curl Martillo", sets: 3, reps: 12 }
  ],
  triceps: [
    { name: "Extensiones con Polea", sets: 4, reps: 15, imageUrl: "https://cdn.shopify.com/s/files/1/0269/5551/3900/files/Triceps-Pressdown_e759437b-6200-4b44-b484-14db770024a4_600x600.png?v=1612136845" },
    { name: "Fondos en Banco", sets: 3, reps: 12 }
  ],
  shoulders: [
    { name: "Press Militar", sets: 4, reps: 10, videoUrl: "https://www.youtube.com/watch?v=7x9PT6FrSLA&pp=ygUccHJlc3MgbWlsaXRhciBjb24gbWFuY3Vlcm5hcw%3D%3D" },
    { name: "Elevaciones Laterales", sets: 3, reps: 15 }
  ],
  abs: [
    { name: "Crunches", sets: 3, reps: 20 },
    { name: "Plancha", sets: 3, reps: 60, imageUrl: "https://hips.hearstapps.com/hmg-prod/images/mid-adult-man-doing-plank-exercise-royalty-free-image-1585917009.jpg?crop=1xw:0.84375xh;center,top&resize=1200:*" }
  ],
  glutes: [
    { name: "Hip Thrust", sets: 4, reps: 15, imageUrl: "https://flex-web-media-prod.storage.googleapis.com/2024/08/hip-thust-workout-2.jpg" },
    { name: "Sentadillas", sets: 3, reps: 12 }
  ],
  quads: [
    { name: "Sentadillas", sets: 4, reps: 12, imageUrl: "https://eresfitness.com/wp-content/uploads/Sentadilla-con-salto.webp" },
    { name: "Prensa de Piernas", sets: 3, reps: 15 }
  ],
  hamstrings: [
    { name: "Peso Muerto", sets: 4, reps: 10, videoUrl: "https://www.youtube.com/watch?v=0XL4cZR2Ink&pp=ygULcGVzbyBtdWVydG8%3D" },
    { name: "Curl Femoral", sets: 3, reps: 12 }
  ],
  calves: [
    { name: "Elevaciones de Talón", sets: 4, reps: 20 },
    { name: "Prensa de Pantorrillas", sets: 3, reps: 15 }
  ]
};

const zoneLabels: Record<number, string> = {
  1: 'Pecho',
  2: 'Espalda',
  3: 'Bíceps',
  4: 'Tríceps',
  5: 'Hombros',
  6: 'Abdomen',
  7: 'Glúteos',
  8: 'Cuádriceps',
  9: 'Isquiotibiales',
  10: 'Pantorrillas',
}

// Exercise popup modal component with mock data
function ExercisePopup({ zoneId, onClose }: { zoneId: number; onClose: () => void }) {
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [loading, setLoading] = useState(true)
  const zoneKey: Record<number, string> = {
    1: 'chest',
    2: 'back',
    3: 'biceps',
    4: 'triceps',
    5: 'shoulders',
    6: 'abs',
    7: 'glutes',
    8: 'quads',
    9: 'hamstrings',
    10: 'calves',
  }

  useEffect(() => {
    // Simulate API loading with mock data
    setLoading(true)
    setTimeout(() => {
      setExercises(mockExercises[zoneKey[zoneId]] || [])
      setLoading(false)
    }, 500) // Simulated 500ms delay
  }, [zoneId])

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
      <div className="bg-white text-black rounded-lg w-full max-w-2xl max-h-[80vh] overflow-y-auto p-6 relative">
        <button 
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-xl"
        >
          ✕
        </button>
        <h2 className="text-2xl font-bold mb-4">
          Ejercicios: {zoneKey[zoneId]}
        </h2>
        
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
          </div>
        ) : (
          <ExerciseList exercises={exercises} />
        )}
      </div>
    </div>
  )
}

// Panel de botones verticales
function ZoneButtonPanel({ onSelectZone }: { onSelectZone: (zone: number) => void }) {
  return (
    <div className="absolute right-140 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 rounded-lg p-2 space-y-2 z-10">
      {Object.entries(zoneLabels).map(([zoneId, label]) => (
        <button
          key={zoneId}
          onClick={() => onSelectZone(parseInt(zoneId))}
          className="flex items-center justify-center bg-red-600 text-white rounded-md w-10 h-10 text-sm font-bold hover:bg-red-500 transition-colors border border-white group relative"
          title={label}
        >
          {zoneId}
          <span className="absolute left-full ml-2 whitespace-nowrap bg-black bg-opacity-75 text-white text-xs rounded px-2 py-1 hidden group-hover:block">
            {label}
          </span>
        </button>
      ))}
    </div>
  )
}

function Model({ modelPath }: Omit<BodyCanvasProps, 'onSelectZone'>) {
  const { scene } = useGLTF(modelPath)
  
  return (
    <primitive object={scene} />
  );
}

function CameraControls() {
  const orbitRef = useRef<any>(null);
  
  useFrame(() => {
    if (orbitRef.current) {
      // Slow rotation to help see all buttons
      orbitRef.current.autoRotateSpeed = 0.5;
      orbitRef.current.autoRotate = true;
    }
  });
  
  return <OrbitControls ref={orbitRef} enablePan={false} enableZoom={true} />;
}

export default function BodyCanvas({ modelPath, onSelectZone }: BodyCanvasProps) {
  const [mounted, setMounted] = useState(false);
  const [selectedZoneId, setSelectedZoneId] = useState<number | null>(null);

  // Custom handler for zone selection that shows popup
  const handleZoneSelect = (zoneId: number) => {
    setSelectedZoneId(zoneId);
    // Also call the parent component's handler
    onSelectZone(zoneId);
  };

  const closePopup = () => {
    setSelectedZoneId(null);
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="relative h-full w-full bg-gray-100 flex items-center justify-center">
      <div className="text-lg">Cargando modelo 3D...</div>
    </div>;
  }

  return (
    <div className="relative h-full w-full">
      {/* Instrucciones */}
      <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white p-2 rounded z-10">
        Selecciona el número para ver ejercicios de acuerdo a la zona
      </div>
      
      {/* Panel de botones vertical */}
      {selectedZoneId === null && (
        <ZoneButtonPanel onSelectZone={handleZoneSelect} />
      )}
      
      {/* Canvas con modelo 3D */}
      <Canvas shadows camera={{ position: [0, 1.5, 3], fov: 50 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
        <directionalLight position={[-5, 5, -5]} intensity={0.5} />
        <Model modelPath={modelPath} />
        <CameraControls />
      </Canvas>
      
      {/* Exercise popup when a zone is selected */}
      {selectedZoneId !== null && (
        <ExercisePopup zoneId={selectedZoneId} onClose={closePopup} />
      )}
    </div>
  );
}
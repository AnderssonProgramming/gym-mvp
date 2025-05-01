/* eslint-disable @typescript-eslint/no-explicit-any */
/* components/BodyCanvas.tsx */
'use client'

import React, { useRef, useState, useEffect } from 'react'
import { Canvas, useFrame, extend } from '@react-three/fiber'
import { OrbitControls, useGLTF, Html } from '@react-three/drei'
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
    { name: "Aperturas con Mancuernas", sets: 3, reps: 15, imageUrl: "https://www.fitprince.com/wp-content/uploads/2017/07/Dumbbell-Fly.jpg" },
    { name: "Fondos en Paralelas", sets: 3, reps: 10 }
  ],
  back: [
    { name: "Dominadas", sets: 4, reps: 8, imageUrl: "https://www.fitprince.com/wp-content/uploads/2017/01/Pull-Up.jpg" },
    { name: "Remo con Barra", sets: 3, reps: 12, imageUrl: "https://www.fitprince.com/wp-content/uploads/2017/04/Barbell-Row.jpg" },
    { name: "Pulldown en Polea", sets: 3, reps: 12 }
  ],
  biceps: [
    { name: "Curl con Barra", sets: 4, reps: 12, imageUrl: "https://www.fitprince.com/wp-content/uploads/2017/08/Barbell-Curl.jpg" },
    { name: "Curl Martillo", sets: 3, reps: 12 }
  ],
  triceps: [
    { name: "Extensiones con Polea", sets: 4, reps: 15, imageUrl: "https://www.fitprince.com/wp-content/uploads/2017/06/Triceps-Pushdown.jpg" },
    { name: "Fondos en Banco", sets: 3, reps: 12 }
  ],
  shoulders: [
    { name: "Press Militar", sets: 4, reps: 10, imageUrl: "https://www.fitprince.com/wp-content/uploads/2017/03/Shoulder-Press.jpg" },
    { name: "Elevaciones Laterales", sets: 3, reps: 15 }
  ],
  abs: [
    { name: "Crunches", sets: 3, reps: 20 },
    { name: "Plancha", sets: 3, reps: 60, imageUrl: "https://www.fitprince.com/wp-content/uploads/2016/05/Plank.jpg" }
  ],
  glutes: [
    { name: "Hip Thrust", sets: 4, reps: 15, imageUrl: "https://www.fitprince.com/wp-content/uploads/2017/10/Hip-Thrust.jpg" },
    { name: "Sentadillas", sets: 3, reps: 12 }
  ],
  quads: [
    { name: "Sentadillas", sets: 4, reps: 12, imageUrl: "https://www.fitprince.com/wp-content/uploads/2016/08/Squat.jpg" },
    { name: "Prensa de Piernas", sets: 3, reps: 15 }
  ],
  hamstrings: [
    { name: "Peso Muerto", sets: 4, reps: 10, imageUrl: "https://www.fitprince.com/wp-content/uploads/2016/11/Deadlift.jpg" },
    { name: "Curl Femoral", sets: 3, reps: 12 }
  ],
  calves: [
    { name: "Elevaciones de Talón", sets: 4, reps: 20 },
    { name: "Prensa de Pantorrillas", sets: 3, reps: 15 }
  ]
};

// Posiciones manuales para cada zona (respaldo en caso de que el cálculo automático falle)
const manualPositions: Record<string, [number, number, number]> = {
  Object_2: [0, 1.3, -3.5],   // Pecho - frente
  Object_3: [0, 1.3, -2.5],  // Espalda - atrás
  Object_4: [0.7, 1.5, -5],   // Bíceps - brazo derecho
  Object_5: [-0.7, 1.9, -1.7],  // Tríceps - brazo izquierdo
  Object_6: [2.2, 1, 3],   // Hombros - arriba
  Object_7: [0, 0.9, -3.3],   // Abdomen - centro/abajo
  Object_8: [0, 0.5, -3.4],     // Glúteos - centro/muy abajo
  Object_9: [0.3, -0.3, -3], // Cuádriceps - pierna derecha
  Object_10: [-0.3, 2, 2.8], // Isquiotibiales - pierna izquierda
  Object_11: [0, -3, -8], // Pantorrillas - muy abajo
}

const zones: Record<string, { zoneId: number; label: string }> = {
  Object_2: { zoneId: 1, label: 'Pecho' },
  Object_3: { zoneId: 2, label: 'Espalda' },
  Object_4: { zoneId: 3, label: 'Bíceps' },
  Object_5: { zoneId: 4, label: 'Tríceps' },
  Object_6: { zoneId: 5, label: 'Hombros' },
  Object_7: { zoneId: 6, label: 'Abdomen' },
  Object_8: { zoneId: 7, label: 'Glúteos' },
  Object_9: { zoneId: 8, label: 'Cuádriceps' },
  Object_10: { zoneId: 9, label: 'Isquiotibiales' },
  Object_11: { zoneId: 10, label: 'Pantorrillas' },
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

// Use a separate component for each button to prevent rendering issues
function ZoneButton({ position, zoneId, label, onSelectZone }: { 
  position: THREE.Vector3, 
  zoneId: number, 
  label: string,
  onSelectZone: (zone: number) => void 
}) {
  return (
    <Html
      position={position}
      center
      occlude={false}
      zIndexRange={[100, 0]}
      distanceFactor={10} // Increased to make buttons even smaller
      transform
      sprite
    >
      <div className="relative group">
        <button
          onClick={() => onSelectZone(zoneId)}
          className="bg-red-600 text-white rounded-full w-2 h-2 flex items-center justify-center text-[6px] font-bold shadow-sm hover:bg-red-400 border-[0.5px] border-white"
          title={label}
        >
          {zoneId}
        </button>
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 whitespace-nowrap bg-black bg-opacity-75 text-white text-[6px] rounded px-0.5 py-0 opacity-0 group-hover:opacity-100">
          {label}
        </div>
      </div>
    </Html>
  );
}

function Model({ modelPath, onSelectZone,selectedZoneId }: BodyCanvasProps & { selectedZoneId: number | null }) {
  const { scene, nodes } = useGLTF(modelPath)
  const [meshesFound, setMeshesFound] = useState<string[]>([])
  const [showDebug, setShowDebug] = useState(true)
  
  // Debug - hide after 10 seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowDebug(false), 10000);
    return () => clearTimeout(timer);
  }, []);
  
  // Use effect to log found meshes once after render
  useEffect(() => {
    const foundMeshes: string[] = [];
    
    Object.entries(zones).forEach(([meshName]) => {
      if (nodes[meshName as keyof typeof nodes]) {
        foundMeshes.push(meshName);
      }
    });
    
    setMeshesFound(foundMeshes);
    console.log('Found meshes:', foundMeshes);
  }, [nodes]);

  // Frame update to ensure all buttons stay visible regardless of camera angle
  useFrame(() => {
    // This keeps buttons facing the camera
    // No need to manually update each button as Html with sprite=true handles this
  });

  // Debug info panel to help see what's happening

  return (
    <group>
      <primitive object={scene} />
      
      {/* Panel de depuración */}
      {showDebug && selectedZoneId === null && (
        <Html position={[0, 0, 0]} transform={false} center={false} fullscreen>
          <div style={{ 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            backgroundColor: 'rgba(0,0,0,0.7)', 
            color: 'white',
            padding: '10px',
            fontSize: '12px',
            zIndex: 1000
          }}>
            <p>Meshes found: {meshesFound.join(', ') || 'None'}</p>
            <p>Showing all 10 body zones with manual positions</p>
          </div>
        </Html>
      )}
      
      {/* Generar todos los botones de zonas usando posiciones manuales */}
      {selectedZoneId === null && Object.entries(zones).map(([meshName, { zoneId, label }]) => {
        // Usar posición manual en vez de depender de la geometría
        const position = new THREE.Vector3(
          manualPositions[meshName][0],
          manualPositions[meshName][1],
          manualPositions[meshName][2]
        );

        return (
          <ZoneButton
            key={meshName}
            position={position}
            zoneId={zoneId}
            label={label}
            onSelectZone={onSelectZone}
          />
        );
      })}
    </group>
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
      <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white p-2 rounded z-10">
        Gira el modelo para ver todas las zonas
      </div>
      <Canvas shadows camera={{ position: [0, 1.5, 3], fov: 50 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
        <directionalLight position={[-5, 5, -5]} intensity={0.5} />
        <Model 
          modelPath={modelPath} 
          onSelectZone={handleZoneSelect} 
          selectedZoneId={selectedZoneId} // Pasar el estado del popup
        />
        <CameraControls />
      </Canvas>
      
      {/* Exercise popup when a zone is selected */}
      {selectedZoneId !== null && (
        <ExercisePopup zoneId={selectedZoneId} onClose={closePopup} />
      )}
    </div>
  );
}
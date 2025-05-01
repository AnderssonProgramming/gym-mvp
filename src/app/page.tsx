/* eslint-disable @typescript-eslint/no-unused-vars */
// src/app/page.tsx
'use client'
export const dynamic = 'force-dynamic'

import dynamicImport from 'next/dynamic'
import { useState, useEffect } from 'react'
//import ExerciseList from '../components/ExerciseList'

// Mapa zoneId → clave para tu API (usa `string`, no `String`)
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
  10:'calves',
}

// Import dinámico RENOMBRADO para evitar choque de nombres
const BodyCanvas = dynamicImport(
  () => import('../components/BodyCanvas'),
  { ssr: false }
)

export default function Home() {
  const [selectedZone, setSelectedZone] = useState<number | null>(null)
  const [exercises, setExercises] = useState([])

  useEffect(() => {
    if (selectedZone) {
      fetch(`/api/exercises?part=${zoneKey[selectedZone]}`)
        .then((r) => r.json())
        .then(setExercises)
    }
  }, [selectedZone])

  return (
    <div className="h-screen">
      <BodyCanvas
        modelPath="/models/male/scene.gltf"
        onSelectZone={setSelectedZone}
      />
    </div>
  )
}

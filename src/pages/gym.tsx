'use client'

import dynamic from 'next/dynamic'
import { useState, useEffect } from 'react'
import ExerciseList from '../components/ExerciseList'

const BodyCanvas = dynamic(
  () => import('../components/BodyCanvas'),
  { ssr: false }
)

type ZoneKey = Record<number, string>
const zoneKey: ZoneKey = {
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

export default function GymPage() {
  const [selectedZone, setSelectedZone] = useState<number | null>(null)
  const [exercises, setExercises] = useState([])

  useEffect(() => {
    if (selectedZone) {
      const part = zoneKey[selectedZone]
      fetch(`/api/exercises?part=${part}`)
        .then(res => res.json())
        .then(setExercises)
    }
  }, [selectedZone])

  return (
    <div className="flex h-screen">
      <div className="w-2/3">
        <BodyCanvas
          modelPath="/models/male/scene.gltf"
          onSelectZone={setSelectedZone}
        />
      </div>
      <div className="w-1/3 p-4 bg-black text-white overflow-auto">
        <h2 className="text-2xl mb-4">
          Zona: {selectedZone ? zoneKey[selectedZone] : '— Selecciona una zona —'}
        </h2>
        <ExerciseList exercises={exercises} />
      </div>
    </div>
  )
}

// components/ExerciseList.tsx
import React from 'react'

export interface Exercise {
  name: string
  sets: number
  reps: number
  videoUrl?: string
  imageUrl?: string
}

interface Props { exercises: Exercise[] }

export default function ExerciseList({ exercises }: Props) {
  if (!exercises.length) return <p>Selecciona una zona del cuerpo</p>
  return (
    <div className="space-y-4">
      {exercises.map((ex) => (
        <div key={ex.name} className="p-4 border rounded shadow">
          <h3 className="font-bold">{ex.name}</h3>
          <p>{ex.sets} x {ex.reps}</p>
          {ex.videoUrl
            ? <video src={ex.videoUrl} controls className="w-full" />
            : ex.imageUrl && <img src={ex.imageUrl} alt={ex.name} className="w-full" />}
        </div>
      ))}
    </div>
  )
}

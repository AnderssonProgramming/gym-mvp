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

/* components/ExerciseList.tsx */
export default function ExerciseList({ exercises }: Props) {
  if (!exercises.length) return <p>No hay ejercicios para esta zona.</p>
    return (
      <div className="space-y-4">
        {exercises.map((ex) => (
          <div key={ex.name} className="p-4 border rounded shadow">
            <h3 className="font-bold">{ex.name}</h3>
            <p className="text-sm text-gray-600">{ex.sets} sets × {ex.reps} repeticiones</p>
            {ex.videoUrl
              ? <video src={ex.videoUrl} controls className="w-full mt-2 rounded" />
              : ex.imageUrl && <img src={ex.imageUrl} alt={ex.name} className="w-full mt-2 rounded" />}
          </div>
        ))}
      </div>
    )
  }
  

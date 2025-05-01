// components/MetricsForm.tsx
import React, { useState } from 'react'

export interface Metrics {
  weight: number
  // mapa de medidas dinámico
  measurements: { [key: string]: number }
  goal: string
}

interface Props { onSubmit: (data: Metrics) => void }

export default function MetricsForm({ onSubmit }: Props) {
  const [weight, setWeight] = useState(0)
  const [measurements, setMeasurements] = useState<{ [k: string]: number }>({
    chest: 0, waist: 0, arms: 0
  })
  const [goal, setGoal] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setMeasurements((m) => ({ ...m, [name]: +value }))
  }

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit({ weight, measurements, goal }) }}>
      <div>
        <label>Peso (kg)</label>
        <input type="number" value={weight} onChange={e => setWeight(+e.target.value)} required />
      </div>
      {Object.keys(measurements).map((part) => (
        <div key={part}>
          <label>{part}</label>
          <input name={part} type="number" onChange={handleChange} required />
        </div>
      ))}
      <div>
        <label>Meta</label>
        <input type="text" value={goal} onChange={e => setGoal(e.target.value)} required />
      </div>
      <button type="submit">Guardar métricas</button>
    </form>
  )
}

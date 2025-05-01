import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
import { useState, useEffect } from 'react'
import MetricsForm, { Metrics } from '../components/MetricsForm'
import ExerciseList from '../components/ExerciseList'

const BodyCanvas = dynamic(() => import('../components/BodyCanvas'), { ssr: false })

export default function GymPage() {
  const { query } = useRouter()
  const model = query.model === 'female' ? '/models/female.gltf' : '/models/male.gltf'

  const [selectedPart, setSelectedPart] = useState<string | null>(null)
  const [exercises, setExercises] = useState([])
  const [metrics, setMetrics] = useState<Metrics | null>(null)

  useEffect(() => {
    if (selectedPart && metrics) {
      // ejemplo de llamada a API local (que deberías implementar)
      fetch(`/api/exercises?part=${selectedPart}&level=${calculateLevel(metrics)}`)
        .then(res => res.json())
        .then(setExercises)
    }
  }, [selectedPart, metrics])

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const calculateLevel = ({ weight, measurements }: Metrics) => {
    // lógica simple: más peso mayor nivel
    return weight < 60 ? 'beginner' : weight < 80 ? 'intermediate' : 'advanced'
  }

  return (
    <div className="flex space-x-4 p-4">
      <div className="w-2/3 h-[80vh]">
        <BodyCanvas modelPath={model} onSelectPart={setSelectedPart} />
      </div>
      <div className="w-1/3 space-y-6">
        {!metrics
          ? <MetricsForm onSubmit={setMetrics} />
          : <ExerciseList exercises={exercises} />}
      </div>
    </div>
  )
}

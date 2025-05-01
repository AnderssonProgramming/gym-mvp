import MetricsForm from '../components/MetricsForm'

export default function Metrics() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Registro de métricas</h1>
      <MetricsForm onSubmit={(data) => console.log(data)} />
    </div>
  )
}

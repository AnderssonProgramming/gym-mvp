import { NextApiRequest, NextApiResponse } from 'next'

type Ex = { name: string; sets: number; reps: number; videoUrl?: string; imageUrl?: string }

const DB: Record<string, Ex[]> = {
  Chest: [
    { name: 'Press de banca', sets: 3, reps: 10, videoUrl: '/videos/bench.mp4' },
    // …
  ],
  Back: [
    { name: 'Remo con barra', sets: 3, reps: 12, imageUrl: '/images/row.png' },
    // …
  ],
  // agrega más zonas…
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { part } = req.query
  res.status(200).json(DB[part as string] || [])
}

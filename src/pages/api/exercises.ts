// pages/api/exercises.ts
import { NextApiRequest, NextApiResponse } from 'next'

type Ex = { name: string; sets: number; reps: number; videoUrl?: string; imageUrl?: string }

const DB: Record<string, Ex[]> = {
  chest:    [ /* … */ ],
  back:     [ /* … */ ],
  biceps:   [ /* … */ ],
  triceps:  [ /* … */ ],
  shoulders:[ /* … */ ],
  abs:      [ /* … */ ],
  glutes:   [ /* … */ ],
  quads:    [ /* … */ ],
  hamstrings:[ /* … */ ],
  calves:   [ /* … */ ],
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const part = (req.query.part as string).toLowerCase()
  res.status(200).json(DB[part] || [])
}

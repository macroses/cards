import type { TrainingSession } from '~/ts'

export default function (sessions: TrainingSession[]): number {
  return sessions.reduce((total: number, session: TrainingSession) => {
    const weight = session.weight || 0
    const repeats = session.repeats || 0
    return total + (weight * repeats) / 1000
  }, 0)
}

import type { UserTrainingSession } from '~/ts/interfaces'

export default function (sessions: UserTrainingSession[]): number {
  return sessions.reduce((total: number, session: UserTrainingSession) => {
    const weight = session.weight || 0
    const repeats = session.repeats || 0
    return total + (weight * repeats) / 1000
  }, 0)
}

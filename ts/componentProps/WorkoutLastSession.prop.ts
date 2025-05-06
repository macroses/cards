import type { UserTrainingSession } from '~/ts/interfaces'

export interface WorkoutLastSessionProps {
  exerciseId: string
  activeExerciseId: string | null
  workoutDate: Date
  lastSets: UserTrainingSession[]
}

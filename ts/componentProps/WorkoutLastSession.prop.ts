import type { TrainingSession } from '~/ts'

export interface WorkoutLastSessionProps {
  exerciseId: string
  activeExerciseId: string | null
  workoutDate: Date
  lastSets: TrainingSession[]
}

import type { TrainingSession, WorkoutExercise } from '~/ts'

export interface UserWorkout extends Required<{
  title: string
  color: string
  exercises: Array<WorkoutExercise>
  sessions: Array<TrainingSession>
  workoutDate: Date
  completed: boolean
}> {
  id?: string
  startedAt: Date | null
  endedAt: Date | null
}

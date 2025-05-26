import type { UserTrainingSession, UserWorkoutExercise } from '~/ts/interfaces'

// done
export interface CreateWorkoutRequest {
  title: string
  color: string
  workoutDate: Date
  exercises: UserWorkoutExercise[]
  sessions: UserTrainingSession[]
}

// done
export interface CreateWorkoutResponse {
  id: string
  userId: string
  title: string
  color: string
  workoutDate: Date
  createdAt: Date
  updatedAt: Date
  completed: boolean
  startedAt?: Date | null
  endedAt?: Date | null
  exercises: {
    id: string
    exerciseName: string
    workoutId: string
    exerciseId: string
  }[]
  sets: UserTrainingSession[]
}

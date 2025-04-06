import type { DIFFICULT_LEVEL } from '~/ts/enums/workoutColors.enum'

export interface UserTrainingSession {
  id: string
  exerciseId: string
  weight: number
  repeats: number
  difficulty: DIFFICULT_LEVEL
  completed: boolean
  setTime?: number | null
  setTimeAddedAt?: string | null
}

export interface UserWorkoutExercise {
  id: string
  name: string
}

export interface UserWorkout extends Required<{
  title: string
  color: string
  exercises: Array<UserWorkoutExercise>
  sessions: Array<UserTrainingSession>
  workoutDate: Date
  completed: boolean
}> {
  id?: string
  startedAt: Date | null
  endedAt: Date | null
}

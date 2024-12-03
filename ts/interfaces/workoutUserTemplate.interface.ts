import type { DIFFICULT_LEVEL } from '~/ts/enums/workoutColors.enum'

export interface UserTrainingSession {
  id: string
  exerciseId: number
  weight: number | null
  repeats: number | null
  difficulty: DIFFICULT_LEVEL
  completed: boolean
}

export interface UserWorkoutExercise {
  id: number
  name: string
}

export interface UserWorkout {
  title: string
  color: string
  exercises: UserWorkoutExercise[]
  sessions: UserTrainingSession[]
  workoutDate: Date
  startedAt: Date | null
  endedAt: Date | null
  completed: boolean
}

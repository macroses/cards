import type { DIFFICULT_LEVEL } from '~/ts/enums/workoutColors.enum'

export interface UserTrainingSession {
  id: string
  exerciseId: number
  weight: number
  repeats: number
  difficulty: DIFFICULT_LEVEL
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
}

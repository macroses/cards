import type { DIFFICULT_LEVEL } from '~/ts/enums/workoutColors.enum'

export interface UserWorkoutExercise {
  exerciseId: number
  sets: UserTrainingSession[]
}

export interface UserWorkout {
  title: string
  color: string
  exercises: UserWorkoutExercise[]
  workoutDate: Date
}

export interface UserTrainingSession {
  id: string
  weight: number
  repeats: number
  difficulty: DIFFICULT_LEVEL
}

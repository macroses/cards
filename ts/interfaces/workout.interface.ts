import type { DIFFICULT_LEVEL } from '~/ts/enums/workoutColors.enum'

// users workout interface
export interface Workout {
  id: string
  userId: string
  title: string
  color: string
  workoutDate: Date
  createdAt: Date
  updatedAt: Date
  exercises: WorkoutExercise[]
}

// users workout exercise interface with sessions
export interface WorkoutExercise {
  id: string
  exerciseId: number
  sets: TrainingSession[]
}

// users workout session in each exercises
export interface TrainingSession {
  id: string
  weight: number
  repeats: number
  difficulty: DIFFICULT_LEVEL
}

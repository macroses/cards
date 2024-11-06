import type { Exercise } from '~/types/Exercise'
import type { ExerciseData, WorkoutSet } from '~/types/Workout'

export interface Props {
  exercises: Exercise[]
  activeExerciseId: number | null
  exerciseData: Map<number, ExerciseData>
  workoutExercises: {
    exerciseId: number
    sets: WorkoutSet[]
  }[]
}

export enum DifficultSet {
  warm = 1,
  low,
  medium,
  high,
  maximum,
}

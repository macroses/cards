import type { UserWorkout, UserWorkoutExercise } from '~/ts/interfaces'

export interface SelectExerciseReturn {
  selectExercise: (
    exercise: UserWorkoutExercise,
    workout: UserWorkout
  ) => Promise<void>
}

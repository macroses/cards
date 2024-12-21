import type { UserWorkout, UserWorkoutExercise } from '~/ts/interfaces/workoutUserTemplate.interface'

export interface SelectExerciseReturn {
  selectExercise: (
    exercise: UserWorkoutExercise,
    workout: UserWorkout
  ) => Promise<void>
}

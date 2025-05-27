import type { UserWorkout, WorkoutExercise } from '~/ts'

export interface SelectExerciseReturn {
  selectExercise: (
    exercise: WorkoutExercise,
    workout: UserWorkout
  ) => Promise<void>
}

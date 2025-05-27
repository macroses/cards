import type { WorkoutExercise } from '~/ts'
import type { UserWorkout } from '~/ts/interfaces'

export interface SelectExerciseReturn {
  selectExercise: (
    exercise: WorkoutExercise,
    workout: UserWorkout
  ) => Promise<void>
}

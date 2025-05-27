import type { WorkoutExercise } from '~/ts'
import type {
  SelectExerciseReturn,
  UserWorkout,
} from '~/ts/interfaces'

/**
 * Composable for selecting exercises for workouts.
 * Handles exercise selection and updates workout data.
 */

export function useSelectExercise(): SelectExerciseReturn {
  const { getLastSets } = useLastExerciseSets()

  async function selectExercise(
    exercise: WorkoutExercise,
    workout: UserWorkout,
  ) {
    const isExerciseExists = workout.exercises.some(ex => ex.id === exercise.id)

    if (!isExerciseExists) {
      workout.exercises.push(exercise)
      getLastSets(exercise.id, workout.workoutDate)
    }
  }

  return {
    selectExercise,
  }
}

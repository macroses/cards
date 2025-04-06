import type {
  SelectExerciseReturn,
  UserWorkout,
  UserWorkoutExercise,
} from '~/ts/interfaces'

/**
 * Composable for selecting exercises for workouts.
 * Handles exercise selection and updates workout data.
 */

export function useSelectExercise(): SelectExerciseReturn {
  const { getLastSets } = useLastExerciseSets()

  async function selectExercise(
    exercise: UserWorkoutExercise,
    workout: UserWorkout,
  ): Promise<void> {
    const isExerciseExists = workout.exercises.some((ex: UserWorkoutExercise) => ex.id === exercise.id)

    if (!isExerciseExists) {
      workout.exercises.push(exercise)
      getLastSets(exercise.id, workout.workoutDate)
    }
  }

  return {
    selectExercise,
  }
}

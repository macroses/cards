import type { UserWorkout, UserWorkoutExercise } from '~/ts/interfaces'

interface SelectExerciseReturn {
  selectExercise: (
    exercise: UserWorkoutExercise,
    workout: UserWorkout
  ) => Promise<void>
}

export function useSelectExercise(): SelectExerciseReturn {
  const { fetchLastSets } = useLastExerciseSets()

  async function selectExercise(
    exercise: UserWorkoutExercise,
    workout: UserWorkout,
  ): Promise<void> {
    const isExerciseExists = workout.exercises.some((ex: UserWorkoutExercise) => ex.id === exercise.id)

    if (!isExerciseExists) {
      workout.exercises.push(exercise)
      await fetchLastSets(exercise.id, workout.workoutDate)
    }
  }

  return {
    selectExercise,
  }
}

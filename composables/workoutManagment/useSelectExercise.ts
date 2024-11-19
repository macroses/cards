import type { UserWorkout, UserWorkoutExercise } from '~/ts/interfaces'

export function useSelectExercise() {
  function selectExercise(
    exercise: UserWorkoutExercise,
    workout: UserWorkout,
  ): void {
    const isExerciseExists = workout.exercises.some((ex: UserWorkoutExercise) => ex.id === exercise.id)

    if (!isExerciseExists) {
      workout.exercises.push(exercise)
    }
  }

  return {
    selectExercise,
  }
}

import type { CreateWorkoutResponse } from '~/ts/interfaces'

/**
 * Composable for managing active exercises during workout.
 * Provides functionality to track selected exercises using a Set collection.
 */

export function useActiveExercises() {
  const activeExercises = ref<Set<string>>(new Set())

  function toggleExercise(exerciseId: string) {
    if (!activeExercises.value.has(exerciseId)) {
      activeExercises.value.add(exerciseId)

      return
    }

    activeExercises.value.delete(exerciseId)
  }

  function initActiveExercise(exercises: CreateWorkoutResponse['exercises']) {
    if (!exercises || exercises.length === 0) {
      return
    }

    activeExercises.value.add(exercises[0].exerciseId)
  }

  return {
    activeExercises,
    toggleExercise,
    initActiveExercise,
  }
}

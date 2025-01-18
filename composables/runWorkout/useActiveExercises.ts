import type { CreateWorkoutResponse } from '~/ts/interfaces/createWorkout.interface'

export function useActiveExercises() {
  const activeExercises = ref<Set<number>>(new Set())

  function toggleExercise(exerciseId: number) {
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

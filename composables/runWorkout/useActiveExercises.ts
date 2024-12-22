export function useActiveExercises() {
  const activeExercises = ref<Set<number>>(new Set())

  function toggleExercise(exerciseId: number) {
    if (activeExercises.value.has(exerciseId)) {
      activeExercises.value.delete(exerciseId)
    }
    else {
      activeExercises.value.add(exerciseId)
    }
  }

  function initActiveExercise(exercises: any[]) {
    if (exercises && exercises.length > 0) {
      activeExercises.value.add(exercises[0].exerciseId)
    }
  }

  return {
    activeExercises,
    toggleExercise,
    initActiveExercise,
  }
}

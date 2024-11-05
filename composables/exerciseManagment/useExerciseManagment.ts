import type { Exercise } from '~/types/Exercise'

export function useExerciseManagement() {
  const selectedExercisesList = ref<Exercise[]>([])
  const activeExerciseId = ref<number | null>(null)
  const exerciseData = reactive(new Map())

  function initExerciseData(exerciseId: number) {
    if (!exerciseData.has(exerciseId)) {
      exerciseData.set(exerciseId, {
        sets: [],
        currentWeight: '',
        currentRepeats: '',
        currentDifficulty: 1,
      })
    }
  }

  function selectExercise(exercise: Exercise) {
    const isExerciseExists = selectedExercisesList.value?.some((existingExercise: Exercise) => existingExercise.id === exercise.id)

    if (!isExerciseExists) {
      selectedExercisesList.value?.push(exercise)
      initExerciseData(exercise.id)
    }
  }

  function removeExercise(exerciseId: number) {
    selectedExercisesList.value = selectedExercisesList.value.filter(exercise => exercise.id !== exerciseId)
    exerciseData.delete(exerciseId)
  }

  function toggleExercise(exerciseId: number) {
    if (activeExerciseId.value && activeExerciseId.value !== exerciseId) {
      const prevExerciseData = exerciseData.get(activeExerciseId.value)
      if (prevExerciseData) {
        prevExerciseData.currentWeight = ''
        prevExerciseData.currentRepeats = ''
        prevExerciseData.currentDifficulty = 1
      }
    }

    if (activeExerciseId.value === exerciseId) {
      const currentExerciseData = exerciseData.get(exerciseId)
      if (currentExerciseData) {
        currentExerciseData.currentWeight = ''
        currentExerciseData.currentRepeats = ''
        currentExerciseData.currentDifficulty = 1
      }
    }

    activeExerciseId.value = activeExerciseId.value === exerciseId ? null : exerciseId
  }

  return {
    selectedExercisesList,
    activeExerciseId,
    exerciseData,
    selectExercise,
    removeExercise,
    toggleExercise,
  }
}

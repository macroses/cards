import type { Exercise, ExerciseData } from '~/types/Exercise'
import type { Workout } from '~/types/Workout'

interface Props {
  workout: Workout
}

export function useExerciseManagement({ workout }: Props) {
  const selectedExercisesList = ref<Exercise[]>([])
  const activeExerciseId = ref<number | null>(null)
  const exerciseData = reactive<Map<number, ExerciseData>>(new Map())

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
    workout.exercises = workout.exercises.filter(exercise => exercise.exerciseId !== exerciseId)
    if (activeExerciseId.value === exerciseId) {
      activeExerciseId.value = null
    }
  }

  function resetExerciseData(exerciseId: number) {
    const exerciseDataToReset = exerciseData.get(exerciseId)
    if (exerciseDataToReset) {
      exerciseDataToReset.currentWeight = ''
      exerciseDataToReset.currentRepeats = ''
      exerciseDataToReset.currentDifficulty = 1
    }
  }

  function toggleExercise(exerciseId: number) {
    if (activeExerciseId.value && activeExerciseId.value !== exerciseId) {
      resetExerciseData(activeExerciseId.value)
    }

    if (activeExerciseId.value === exerciseId) {
      resetExerciseData(exerciseId)
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

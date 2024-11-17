import type { ExerciseServerTemplate } from '~/ts/interfaces'

export function useSelectExercise() {
  const selectedExercisesList = ref<ExerciseServerTemplate[]>([])

  function fillExercisesList(exercise: ExerciseServerTemplate) {
    const isExerciseExists = selectedExercisesList.value?.some((existingExercise: ExerciseServerTemplate) => {
      return existingExercise.id === exercise.id
    })

    if (!isExerciseExists) {
      selectedExercisesList.value?.push(exercise)
    }
  }

  return {
    selectedExercisesList,
    fillExercisesList,
  }
}

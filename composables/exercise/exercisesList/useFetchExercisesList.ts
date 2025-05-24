import type { ExerciseServerTemplate } from '~/ts/interfaces'
import exercisesData from '~/data/exercises.json'

export function useFetchExercisesList() {
  const exercisesList = ref<ExerciseServerTemplate[]>(exercisesData)

  return { exercisesList }
}

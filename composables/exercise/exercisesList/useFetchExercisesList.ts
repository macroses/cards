import type { ExerciseTemplate } from '~/ts'
import exercisesData from '~/data/exercises.json'

export function useFetchExercisesList() {
  const exercisesList = ref<ExerciseTemplate[]>(exercisesData)

  return { exercisesList }
}

import type { ExerciseServerTemplate } from '~/ts/interfaces'

const API_EXERCISES_LIST_URL = '/api/exercises/exercises'

interface ExerciseGroup {
  primary: string
  exercises: ExerciseServerTemplate[]
}

export function useGetExercisesList() {
  const { data: exercisesList } = useAsyncData<ExerciseGroup[]>(
    'get-exercises-list',
    () => $fetch(API_EXERCISES_LIST_URL),
  )

  return { exercisesList }
}

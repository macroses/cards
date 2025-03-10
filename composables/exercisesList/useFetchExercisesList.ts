import { API_EXERCISES_LIST_URL, KEY_EXERCISES_LIST } from '~/constants'
import type { ExerciseServerTemplate } from '~/ts/interfaces'
import { useCachedFetch } from '~/utils/useCachedFetch'

export function useFetchExercisesList() {
  const { data: exercisesList, status, error, refresh } = useCachedFetch<unknown, ExerciseServerTemplate[]>({
    url: API_EXERCISES_LIST_URL,
    key: KEY_EXERCISES_LIST,
    transform: (payload) => {
      if (!Array.isArray(payload)) {
        return []
      }

      return payload as ExerciseServerTemplate[]
    },
    initialData: [],
  })

  return {
    exercisesList,
    status,
    error,
    refresh,
  }
}

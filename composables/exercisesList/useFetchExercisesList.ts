import { API, KEYS } from '~/constants'
import type { ExerciseServerTemplate } from '~/ts/interfaces'
import { useCachedFetch } from '~/utils/useCachedFetch'

export function useFetchExercisesList() {
  const { data: exercisesList, status, error, refresh } = useCachedFetch<unknown, ExerciseServerTemplate[]>({
    url: API.EXERCISES_LIST,
    key: KEYS.GET_EXERCISES_LIST,
    transform: (payload) => {
      if (!Array.isArray(payload)) {
        return []
      }

      return payload
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

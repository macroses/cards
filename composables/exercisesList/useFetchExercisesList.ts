import { API_EXERCISES_LIST_URL, KEY_EXERCISES_LIST } from '~/constants'
import type { ExerciseServerTemplate } from '~/ts/interfaces'

interface TransformedExerciseData {
  data: ExerciseServerTemplate[]
  fetchedAt: Date
}

export function useFetchExercisesList() {
  const nuxtApp = useNuxtApp()

  const { data: exercisesList, error, status, refresh } = useLazyFetch<TransformedExerciseData>(
    API_EXERCISES_LIST_URL,
    {
      key: KEY_EXERCISES_LIST,
      transform: (payload: unknown): TransformedExerciseData => {
        return Array.isArray(payload)
          ? {
              data: payload as ExerciseServerTemplate[],
              fetchedAt: new Date(),
            }
          : {
              data: [],
              fetchedAt: new Date(),
            }
      },
      getCachedData: (key: string): TransformedExerciseData | undefined => {
        const data = nuxtApp.payload.data[key] || nuxtApp.static.data[key]

        if (!data) {
          return undefined
        }

        const expiration = new Date(data.fetchedAt)
        expiration.setTime(expiration.getTime() + 1000 * 60 * 60 * 24)

        const isExpired = expiration.getTime() < Date.now()

        if (isExpired) {
          return undefined
        }

        return data as TransformedExerciseData
      },
    },
  )

  return {
    exercisesList: computed(() => exercisesList.value?.data || []),
    status,
    error,
    refresh,
  }
}

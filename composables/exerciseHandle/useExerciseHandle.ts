import type { ExerciseServerTemplate } from '~/ts/interfaces'
import { useCachedFetch } from '~/utils/useCachedFetch'

export function useExerciseHandle() {
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const { data: exercises, refresh: refreshExercises } = useCachedFetch<unknown, ExerciseServerTemplate[]>({
    url: '/api/exercises/getUserExercises',
    key: 'user-exercises',
    transform: (payload) => {
      if (!Array.isArray(payload)) {
        return []
      }
      return payload as ExerciseServerTemplate[]
    },
    initialData: [],
  })

  const createExercise = async (exercise: Omit<ExerciseServerTemplate, 'id'>) => {
    try {
      isLoading.value = true
      error.value = null

      const response = await $fetch<ExerciseServerTemplate>('/api/exercises/createUserExercise', {
        method: 'POST',
        body: exercise,
      })

      if (exercises.value) {
        exercises.value.push(response)
      }

      return response
    }
    catch (e) {
      error.value = 'Ошибка при создании упражнения'
      console.error(e)
    }
    finally {
      isLoading.value = false
    }
  }

  return {
    exercises,
    isLoading,
    error,
    createExercise,
    refreshExercises,
  }
}

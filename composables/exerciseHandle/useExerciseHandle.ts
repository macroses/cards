import type { ExerciseServerTemplate } from '~/ts/interfaces'
import { API, KEYS } from '~/constants'
import { ToastStatusesEnum } from '~/ts/enums/toastStatuses.enum'
import { useCachedFetch } from '~/utils/useCachedFetch'

export function useExerciseHandle() {
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const { t } = useI18n()
  const { toast } = useToastState()

  const { data: exercises, refresh: refreshExercises } = useCachedFetch<unknown, ExerciseServerTemplate[]>({
    url: API.GET_USER_EXERCISES,
    key: KEYS.USER_EXERCISES,
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

      const response = await $fetch<ExerciseServerTemplate>(API.CREATE_USER_EXERCISE, {
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

  const deleteExercise = async (id: string) => {
    try {
      isLoading.value = true
      error.value = null

      await $fetch(API.DELETE_USER_EXERCISE, {
        method: 'DELETE',
        body: { id },
      })

      await refreshExercises()
    }
    catch (e: any) {
      error.value = e.message
      toast(t('toast.exercise_delete_error'), ToastStatusesEnum.ERROR)
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
    deleteExercise,
  }
}

import type { ExerciseTemplate } from '~/ts'
import { API, KEYS } from '~/constants'
import { ToastStatusesEnum } from '~/ts/enums/toastStatuses.enum'

/*
 * Composable for exercise handle
 * - create exercise
 * - delete exercise
 */

export function useExerciseHandle() {
  const exercisesState = useState<ExerciseTemplate[] | null>(KEYS.USER_EXERCISES, () => null)
  const isLoading = shallowRef(false)
  const error = shallowRef<string | null>(null)
  const { t } = useI18n()
  const { toast } = useToastState()

  async function fetchExercises() {
    if (exercisesState.value !== null && !isLoading.value) {
      return exercisesState.value
    }

    try {
      isLoading.value = true
      error.value = null

      const data = await $fetch<ExerciseTemplate[]>(API.GET_USER_EXERCISES)
      exercisesState.value = data

      return data
    }
    catch (e) {
      error.value = t('error.exercises_fetch')
      console.error(e)
      return null
    }
    finally {
      isLoading.value = false
    }
  }

  async function createExercise(exercise: Omit<ExerciseTemplate, 'id'>) {
    try {
      isLoading.value = true
      error.value = null

      const response = await $fetch<ExerciseTemplate>(API.CREATE_USER_EXERCISE, {
        method: 'POST',
        body: exercise,
      })

      if (exercisesState.value) {
        exercisesState.value.push(response)
      }

      return response
    }
    catch (e) {
      error.value = t('error.exercise_create')
      console.error(e)
    }
    finally {
      isLoading.value = false
    }
  }

  async function deleteExercise(id: string) {
    try {
      isLoading.value = true
      error.value = null

      await $fetch(API.DELETE_USER_EXERCISE, {
        method: 'DELETE',
        body: { id },
      })

      await fetchExercises()
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
    exercises: exercisesState,
    isLoading,
    error,
    fetchExercises,
    createExercise,
    deleteExercise,
  }
}

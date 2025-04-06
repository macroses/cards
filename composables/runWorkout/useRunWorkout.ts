import type { CreateWorkoutResponse } from '~/ts/interfaces'
import { getCachedData } from '~/utils/cacheRunnedWorkout'

/**
 * Composable for running workout.
 * Gets workout from cache, redirects to home page if not found.
 */

export function useRunWorkout() {
  const route = useRoute()
  const workoutId = route.params.id as string
  const workout = ref<CreateWorkoutResponse | null>(null)
  const isLoading = ref(true)
  const error = ref<string | null>(null)

  const { t } = useI18n()

  onMounted(async () => {
    if (!workoutId) {
      error.value = 'ID тренировки не указан'
      isLoading.value = false
      return
    }

    try {
      const cachedResult = await getCachedData('workout', workoutId)

      if (!cachedResult) {
        error.value = t('error.workout_not_in_cache')

        return
      }

      workout.value = cachedResult
    }
    catch (err: unknown) {
      console.error(err)
    }
    finally {
      isLoading.value = false
    }
  })

  return {
    workout,
    isLoading,
    error,
  }
}

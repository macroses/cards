import type { CreateWorkoutResponse } from '~/ts/interfaces'
import { getCachedData } from '~/utils/cacheRunnedWorkout'

/**
 * Composable for running workout.
 * Gets workout from cache, redirects to home page if not found.
 */

const CACHE_KEY = 'workout'

export function useRunWorkout() {
  const route = useRoute()
  const workoutId = computed(() => route.params.id as string)
  const workout = ref<CreateWorkoutResponse | null>(null)
  const isLoading = shallowRef(true)
  const error = shallowRef<string | null>(null)
  const { t } = useI18n()

  async function fetchWorkout(): Promise<CreateWorkoutResponse | null> {
    if (!workoutId.value) {
      error.value = 'ID тренировки не указан'
      return null
    }

    try {
      return await getCachedData(CACHE_KEY, workoutId.value)
    }
    catch (err) {
      console.error('Error fetching cached workout:', err)
      return null
    }
  }

  onMounted(async () => {
    try {
      const cachedWorkout = await fetchWorkout()

      if (!cachedWorkout) {
        error.value = t('error.workout_not_in_cache')
        return
      }

      workout.value = cachedWorkout
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

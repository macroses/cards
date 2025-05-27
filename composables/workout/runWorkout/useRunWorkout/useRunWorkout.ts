import type { WorkoutResponse } from '~/ts'
import { getCachedData } from '~/utils/cacheRunnedWorkout'

/**
 * Composable for running workout.
 * Gets workout from the cache, redirects to the home page if not found.
 */

const CACHE_KEY = 'workout'
const ORIGINAL_CACHE_KEY = 'workout-original'

interface CachedWorkout {
  current: WorkoutResponse | null
  original: WorkoutResponse | null
}

export function useRunWorkout() {
  const route = useRoute()
  const workoutId = computed(() => route.params.id as string)
  const workout = ref<WorkoutResponse | null>(null)
  const originalWorkout = ref<WorkoutResponse | null>(null)
  const isLoading = shallowRef(true)
  const error = shallowRef<string | null>(null)
  const { t } = useI18n()

  async function fetchWorkout(): Promise<CachedWorkout> {
    if (!workoutId.value) {
      error.value = 'ID тренировки не указан'

      return { current: null, original: null }
    }

    try {
      const current = await getCachedData(CACHE_KEY, workoutId.value)
      const original = await getCachedData(ORIGINAL_CACHE_KEY, workoutId.value)

      return { current, original }
    }
    catch (err) {
      console.error('Error fetching cached workout:', err)
      return { current: null, original: null }
    }
  }

  onMounted(async () => {
    try {
      const { current, original } = await fetchWorkout()

      if (!current) {
        error.value = t('error.workout_not_in_cache')
        return
      }

      workout.value = current

      if (original) {
        originalWorkout.value = original
      }
      else {
        originalWorkout.value = structuredClone(current)

        try {
          await saveCacheData(ORIGINAL_CACHE_KEY, originalWorkout.value)
        }
        catch (e) {
          console.error('Failed to cache original workout:', e)
        }
      }
    }
    finally {
      isLoading.value = false
    }
  })

  return {
    workout,
    originalWorkout,
    isLoading,
    error,
  }
}

import type { WorkoutResponse } from '~/ts'
import {
  API,
  KEYS,
} from '~/constants'

/**
 * Composable for fetching user's workouts.
 * Retrieves a workout list from API and manages to load state.
 */

export function useFetchWorkoutsByUserId() {
  const workouts = useState<WorkoutResponse[] | null>(KEYS.GLOBAL_WORKOUTS, () => null)
  const { t } = useI18n()
  const isLoading = shallowRef(false)
  const error = shallowRef<string | null>(null)

  async function fetchWorkouts() {
    isLoading.value = true

    try {
      workouts.value = await $fetch<WorkoutResponse[]>(API.WORKOUTS_LIST)
    }
    catch (err: unknown) {
      console.error(err)
      error.value = t('error.workouts_load_error')
      workouts.value = null
    }
    finally {
      isLoading.value = false
    }
  }

  const isChartControlVisible = computed(() => {
    if (!workouts.value) {
      return false
    }

    return workouts.value.filter(workout => workout.completed).length >= 5
  })

  return {
    workouts,
    isLoading,
    error,
    fetchWorkouts,
    isChartControlVisible,
  }
}

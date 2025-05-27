import type { WorkoutResponse } from '~/ts'
import { ZodError } from 'zod'
import {
  API,
  KEYS,
} from '~/constants'
import { workoutResponseSchema } from '~/ts'

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
      const response = await $fetch(API.WORKOUTS_LIST)

      const validatedData = workoutResponseSchema.array().parse(response)

      workouts.value = validatedData
    }
    catch (err: unknown) {
      if (err instanceof ZodError) {
        console.error('Данные не соответствуют схеме:', err)
      }

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

import { GLOBAL_WORKOUTS } from '~/constants'
import type { CreateWorkoutResponse } from '~/ts/interfaces'

const API_WORKOUTS = '/api/workout/workouts'

export function useGetWorkouts() {
  const { t } = useI18n()
  const workouts = useState<CreateWorkoutResponse[] | null>(GLOBAL_WORKOUTS, () => null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  async function fetchWorkouts() {
    try {
      isLoading.value = true
      workouts.value = await $fetch<CreateWorkoutResponse[]>(API_WORKOUTS)
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

  return {
    workouts,
    isLoading,
    error,
    fetchWorkouts,
  }
}

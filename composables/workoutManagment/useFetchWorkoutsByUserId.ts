import {
  API,
  AUTHENTICATED,
  KEYS,
} from '~/constants'
import type { CreateWorkoutResponse } from '~/ts/interfaces'

export function useFetchWorkoutsByUserId() {
  const workouts = useState<CreateWorkoutResponse | null>(KEYS.GLOBAL_WORKOUTS, () => null)
  const { status } = useAuth()
  const { t } = useI18n()
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  async function fetchWorkouts() {
    try {
      isLoading.value = true

      if (status.value !== AUTHENTICATED) {
        return
      }

      workouts.value = await $fetch<CreateWorkoutResponse>(API.WORKOUTS_LIST)
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

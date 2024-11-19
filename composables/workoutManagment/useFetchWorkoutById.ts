import type { LocationQueryValue } from '#vue-router'
import type { UserWorkout } from '~/ts/interfaces'

export function useFetchWorkoutById() {
  const { t } = useI18n()

  const data = ref<UserWorkout | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  async function fetchWorkoutById(workoutId: string | LocationQueryValue[]) {
    try {
      isLoading.value = true
      data.value = await $fetch<UserWorkout>(`/api/workout/${workoutId}`)
    }
    catch (err: unknown) {
      console.error(err)
      error.value = t('error.workout_load_error')
      data.value = null
    }
    finally {
      isLoading.value = false
    }
  }

  return {
    data,
    isLoading,
    error,
    fetchWorkoutById,
  }
}

import type { CreateWorkoutRequest, UserWorkout } from '~/ts/interfaces'

const API_CREATE = '/api/workout/create'

export function useSubmitWorkout() {
  const { t } = useI18n()
  const { toast } = useToastState()
  const isLoading = ref(false)

  async function submitWorkout(workout: UserWorkout) {
    try {
      isLoading.value = true

      await $fetch<CreateWorkoutRequest>(API_CREATE, {
        method: 'POST',
        body: workout,
      })

      navigateTo('/')

      toast(t('toast.workout_created'), 'success')
      return true
    }
    catch (error: unknown) {
      console.error('Error create workout', error)
      toast(t('error.workout_create_error'), 'error')
      return false
    }
    finally {
      isLoading.value = false
    }
  }

  return {
    submitWorkout,
    isLoading,
  }
}

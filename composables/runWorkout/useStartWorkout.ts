const API_START = '/api/start-workout/startWorkout'

export function useStartWorkout() {
  const { t } = useI18n()
  const { toast } = useToastState()
  const isLoading = ref(false)

  async function startWorkout(workoutId: string) {
    try {
      isLoading.value = true

      await $fetch(API_START, {
        method: 'PUT',
        body: { workoutId },
      })

      return true
    }
    catch (error: unknown) {
      console.error('Error starting workout:', error)
      toast(t('toast.workout_start_error'), 'error')

      return false
    }
    finally {
      isLoading.value = false
    }
  }

  return {
    startWorkout,
    isLoading,
  }
}

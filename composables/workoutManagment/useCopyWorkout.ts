const API_COPY = '/api/workout/workoutCopy'

export function useCopyWorkout() {
  const { t } = useI18n()
  const { toast } = useToastState()
  const { fetchWorkouts } = useFetchWorkoutsByUserId()
  const isLoading = ref(false)

  async function copyWorkout(workoutId: string, newDate: Date) {
    try {
      isLoading.value = true

      await $fetch(API_COPY, {
        method: 'POST',
        body: {
          workoutId,
          newDate,
        },
      })

      toast(t('toast.workout_copied'), 'success')
      await fetchWorkouts()

      return true
    }
    catch (error: unknown) {
      console.error('Error copy workout', error)
      toast(t('toast.workout_copy_error'), 'error')
      return false
    }
    finally {
      isLoading.value = false
    }
  }

  return {
    copyWorkout,
    isLoading,
  }
}

const API_DELETE = '/api/workout/workoutDelete'

export function useDeleteWorkout() {
  const { t } = useI18n()
  const { toast } = useToastState()
  const isLoading = ref(false)
  const { fetchWorkouts } = useFetchWorkoutsByUserId()

  async function deleteWorkout(id: string) {
    try {
      isLoading.value = true

      const successDelete = await $fetch<boolean>(API_DELETE, {
        method: 'DELETE',
        body: { id },
      })

      if (successDelete) {
        toast(t('toast.workout_deleted'), 'success')
        await fetchWorkouts()
      }

      return true
    }
    catch (error: unknown) {
      console.error('Error delete workout', error)
      toast(t('toast.workout_delete_error'), 'error')

      return false
    }
    finally {
      isLoading.value = false
    }
  }

  return {
    deleteWorkout,
  }
}

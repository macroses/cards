import { API_DELETE } from '~/constants'
import { ToastStatusesEnum } from '~/ts/enums/toastStatuses.enum'

export function useDeleteWorkout() {
  const { t } = useI18n()
  const { toast } = useToastState()
  const isLoading = ref(false)
  const { fetchWorkouts } = useFetchWorkoutsByUserId()
  // const workouts = useState<CreateWorkoutResponse[]>(GLOBAL_WORKOUTS)
  const { stopTimer } = useWorkoutTimer()

  async function deleteWorkout(id: string) {
    try {
      isLoading.value = true

      const successDelete = await $fetch<boolean>(API_DELETE, {
        method: 'DELETE',
        body: { id },
      })

      if (successDelete) {
        stopTimer()
        toast(t('toast.workout_deleted'), ToastStatusesEnum.SUCCESS)
        await fetchWorkouts()

        // checkActiveWorkout(workouts.value)
      }

      return true
    }
    catch (error: unknown) {
      console.error('Error delete workout', error)
      toast(t('toast.workout_delete_error'), ToastStatusesEnum.ERROR)

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

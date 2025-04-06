import type { CreateWorkoutResponse } from '~/ts/interfaces'
import { API, GLOBAL_WORKOUTS } from '~/constants'
import { ToastStatusesEnum } from '~/ts/enums/toastStatuses.enum'
import { deleteCachedData } from '~/utils/cacheRunnedWorkout'

/**
 * Composable for deleting workouts.
 * Handles workout deletion, updates local state, and clears cache.
 */

export function useDeleteWorkout() {
  const { t } = useI18n()
  const { toast } = useToastState()
  const isLoading = ref(false)
  const { fetchWorkouts } = useFetchWorkoutsByUserId()
  const workouts = useState<CreateWorkoutResponse[]>(GLOBAL_WORKOUTS)
  const { stopTimer, checkActiveWorkout } = useWorkoutTimer()

  async function deleteWorkout(id: string) {
    try {
      isLoading.value = true

      const successDelete = await $fetch<boolean>(API.DELETE_WORKOUT, {
        method: 'DELETE',
        body: { id },
      })

      if (successDelete) {
        stopTimer()
        toast(t('toast.workout_deleted'), ToastStatusesEnum.SUCCESS)
        await fetchWorkouts()

        checkActiveWorkout(workouts.value)

        await deleteCachedData('workout', id)
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

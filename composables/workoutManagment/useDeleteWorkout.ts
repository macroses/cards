import type { CreateWorkoutResponse } from '~/ts/interfaces'
import { API, KEYS } from '~/constants'
import { ToastStatusesEnum } from '~/ts/enums/toastStatuses.enum'
import { deleteCachedData } from '~/utils/cacheRunnedWorkout'

/**
 * Composable for deleting workouts.
 * Handles workout deletion, updates local state, and clears cache.
 */

export function useDeleteWorkout() {
  const { t } = useI18n()
  const { toast } = useToastState()
  const isLoading = shallowRef(false)
  const workouts = useState<CreateWorkoutResponse[]>(KEYS.GLOBAL_WORKOUTS)
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

        const indexToDelete = workouts.value.findIndex(workout => workout.id === id)
        if (indexToDelete > -1) {
          workouts.value.splice(indexToDelete, 1)
        }

        checkActiveWorkout(workouts.value)

        await deleteCachedData('workout', id)
      }
    }
    catch (error: unknown) {
      console.error('Error delete workout', error)
      toast(t('toast.workout_delete_error'), ToastStatusesEnum.ERROR)
    }
    finally {
      isLoading.value = false
    }
  }

  return {
    deleteWorkout,
  }
}

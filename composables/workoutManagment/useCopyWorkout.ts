import type { CreateWorkoutResponse } from '~/ts/interfaces'
import { API, KEYS } from '~/constants'
import { ToastStatusesEnum } from '~/ts/enums/toastStatuses.enum'

/**
 * Composable for copying workouts.
 * Creates a new workout based on an existing one with a specified date.
 */

export function useCopyWorkout() {
  const { t } = useI18n()
  const { toast } = useToastState()
  const workouts = useState<CreateWorkoutResponse[]>(KEYS.GLOBAL_WORKOUTS)
  const isLoading = shallowRef(false)

  async function copyWorkout(workoutId: string, newDate: Date) {
    try {
      isLoading.value = true

      const copiedWorkout = await $fetch<CreateWorkoutResponse>(API.COPY_WORKOUT, {
        method: 'POST',
        body: {
          workoutId,
          newDate,
        },
      })

      toast(t('toast.workout_copied'), ToastStatusesEnum.SUCCESS)

      if (workouts.value) {
        workouts.value = [copiedWorkout, ...workouts.value]
      }

      return true
    }
    catch (error: unknown) {
      console.error('Error copy workout', error)
      toast(t('toast.workout_copy_error'), ToastStatusesEnum.ERROR)

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

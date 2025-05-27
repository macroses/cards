import type { WorkoutResponse } from '~/ts'
import { API, KEYS } from '~/constants'
import { ToastStatusesEnum } from '~/ts/enums/toastStatuses.enum'

/**
 * Composable for starting a workout.
 * Updates workout in a database, updates local state, and starts a timer.
 */

export function useStartWorkout() {
  const { t } = useI18n()
  const { toast } = useToastState()
  const isLoading = shallowRef(false)
  const workoutsList = useState<WorkoutResponse[]>(KEYS.GLOBAL_WORKOUTS)

  function updateWorkoutsList(workoutId: string, startedAt?: Date | null) {
    if (!workoutsList.value) {
      return
    }

    workoutsList.value = workoutsList.value.map(workout => workout.id === workoutId
      ? { ...workout, startedAt }
      : workout,
    )
  }

  function initWorkoutTimer(workoutId: string, startedAt?: Date | null) {
    if (!startedAt) {
      return
    }

    const { startTimer } = useWorkoutTimer()
    startTimer(startedAt, workoutId)
  }

  async function startWorkout(workoutId: string) {
    try {
      isLoading.value = true

      const updatedWorkout = await $fetch<WorkoutResponse>(API.START_WORKOUT, {
        method: 'PUT',
        body: { workoutId },
      })

      updateWorkoutsList(workoutId, updatedWorkout.startedAt)
      initWorkoutTimer(updatedWorkout.id, updatedWorkout.startedAt)

      return true
    }
    catch (error: unknown) {
      console.error(t('error.workout_start'), error)
      toast(t('toast.workout_start_error'), ToastStatusesEnum.ERROR)
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

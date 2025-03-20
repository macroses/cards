import type { CreateWorkoutResponse } from '~/ts/interfaces'
import { API, KEYS } from '~/constants'
import { ToastStatusesEnum } from '~/ts/enums/toastStatuses.enum'

export function useStartWorkout() {
  const { t } = useI18n()
  const { toast } = useToastState()
  const isLoading = ref(false)
  const workoutsList = useState<CreateWorkoutResponse[] | []>(KEYS.GLOBAL_WORKOUTS)

  async function startWorkout(workoutId: string) {
    try {
      isLoading.value = true

      const updatedWorkout = await $fetch<CreateWorkoutResponse>(API.START_WORKOUT, {
        method: 'PUT',
        body: { workoutId },
      })

      // Обновляем тренировку локально в списке
      if (workoutsList.value) {
        workoutsList.value = workoutsList.value.map(workout =>
          workout.id === workoutId
            ? { ...workout, startedAt: updatedWorkout.startedAt }
            : workout,
        )
      }

      const { startTimer } = useWorkoutTimer()

      if (updatedWorkout.startedAt) {
        startTimer(new Date(updatedWorkout.startedAt), updatedWorkout.id)
      }

      return true
    }
    catch (error: unknown) {
      console.error('Error starting workout:', error)
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

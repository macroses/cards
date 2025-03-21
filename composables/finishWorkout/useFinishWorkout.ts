import type { ChartsApiResponse, CreateWorkoutResponse, Statistics } from '~/ts/interfaces'
import { API, KEYS } from '~/constants'
import { ToastStatusesEnum } from '~/ts/enums/toastStatuses.enum'

export function useFinishWorkout() {
  const isLoading = ref(false)
  const workoutsList = useState<CreateWorkoutResponse[] | []>(KEYS.GLOBAL_WORKOUTS)
  const globalStats = useState<Statistics | null>(KEYS.GLOBAL_STATISTICS)
  const chartsState = useState<ChartsApiResponse | null>(KEYS.CHARTS_DATA)

  const { t } = useI18n()
  const { toast } = useToastState()
  const { stopTimer } = useWorkoutTimer()
  const { fetchWorkouts } = useFetchWorkoutsByUserId()

  async function endWorkout(workoutId: string) {
    try {
      isLoading.value = true

      const updatedWorkout = await $fetch<CreateWorkoutResponse>(API.FINISH_WORKOUT, {
        method: 'PUT',
        body: {
          workoutId,
          completed: true,
        },
      })

      // Обновляем тренировку локально в списке
      if (workoutsList.value) {
        workoutsList.value = workoutsList.value.map(workout =>
          workout.id === workoutId
            ? {
                ...workout,
                endedAt: updatedWorkout.endedAt,
                completed: updatedWorkout.completed,
              }
            : workout,
        )
      }

      stopTimer()
      toast(t('toast.workout_ended'), ToastStatusesEnum.SUCCESS)
      await fetchWorkouts()

      // Сбрасываем значение глобальной статистики, чтобы триггернуть её refresh
      globalStats.value = null
      chartsState.value = null

      return true
    }
    catch (error: unknown) {
      console.error('Error ending workout:', error)
      toast(t('toast.workout_end_error'), ToastStatusesEnum.ERROR)
      return false
    }
    finally {
      isLoading.value = false
    }
  }

  async function resetNoTimeWorkout(runWorkoutId?: string) {
    if (runWorkoutId) {
      try {
        await $fetch(API.RESET_WORKOUT, {
          method: 'PUT',
          body: {
            workoutId: runWorkoutId,
          },
        })

        stopTimer()
        navigateTo('/')
        await fetchWorkouts()
      }
      catch (error) {
        console.error('Error resetting workout:', error)
        toast(t('toast.workout_update_error'), ToastStatusesEnum.ERROR)
      }
    }
  }

  return {
    endWorkout,
    isLoading,
    resetNoTimeWorkout,
  }
}

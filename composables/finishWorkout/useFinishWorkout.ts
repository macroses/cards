import { API_END, GLOBAL_WORKOUTS } from '~/constants'
import { ToastStatusesEnum } from '~/ts/enums/toastStatuses.enum'
import type { CreateWorkoutResponse } from '~/ts/interfaces'

export function useFinishWorkout() {
  const isLoading = ref(false)
  const workoutsList = useState<CreateWorkoutResponse[] | []>(GLOBAL_WORKOUTS)

  const { runWorkout } = useRunWorkout()
  const { t } = useI18n()
  const { toast } = useToastState()
  const { stopTimer } = useWorkoutTimer()
  const { fetchWorkouts } = useFetchWorkoutsByUserId()

  async function endWorkout(workoutId: string) {
    try {
      isLoading.value = true

      const updatedWorkout = await $fetch<CreateWorkoutResponse>(API_END, {
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

      // Останавливаем таймер
      stopTimer()

      toast(t('toast.workout_ended'), ToastStatusesEnum.SUCCESS)
      await fetchWorkouts()
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

  async function resetNoTimeWorkout() {
    if (runWorkout.value) {
      try {
        await $fetch('/api/workout/resetWorkout', {
          method: 'PUT',
          body: {
            workoutId: runWorkout.value.id,
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

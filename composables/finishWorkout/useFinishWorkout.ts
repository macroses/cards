import { GLOBAL_WORKOUTS } from '~/constants'
import type { CreateWorkoutResponse } from '~/ts/interfaces'

const API_END = '/api/finish-workout/finishWorkout'

export function useFinishWorkout() {
  const { t } = useI18n()
  const { toast } = useToastState()
  const isLoading = ref(false)
  const workoutsList = useState<CreateWorkoutResponse[] | []>(GLOBAL_WORKOUTS)
  const { stopTimer } = useWorkoutTimer()

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

      toast(t('toast.workout_ended'), 'success')
      return true
    }
    catch (error: unknown) {
      console.error('Error ending workout:', error)
      toast(t('toast.workout_end_error'), 'error')
      return false
    }
    finally {
      isLoading.value = false
    }
  }

  return {
    endWorkout,
    isLoading,
  }
}

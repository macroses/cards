import type {
  ChartsApiResponse,
  CreateWorkoutResponse,
  Statistics,
  UserTrainingSession,
} from '~/ts/interfaces'
import { API, KEYS } from '~/constants'
import { ToastStatusesEnum } from '~/ts/enums/toastStatuses.enum'
import { deleteCachedData, getCachedData } from '~/utils/cacheRunnedWorkout'
import { useWorkoutTimer } from '../workoutTimer/useWorkoutTimer'

/*
 * Composable for finishing workout
 * When workout is finished:
 * - update workout in database
 * - update workout in local state
 * - delete workout from cache
 * - stop timer
 * - redirect to home page
*/

export function useFinishWorkout() {
  const workoutsList = useState<CreateWorkoutResponse[] | []>(KEYS.GLOBAL_WORKOUTS)
  const globalStats = useState<Statistics | null>(KEYS.GLOBAL_STATISTICS)
  const chartsState = useState<ChartsApiResponse | null>(KEYS.CHARTS_DATA)

  const { t } = useI18n()
  const { toast } = useToastState()
  const { stopTimer } = useWorkoutTimer()
  const isLoading = shallowRef(false)

  async function finishWorkout(workoutId: string) {
    try {
      isLoading.value = true

      const cachedWorkout = await getCachedData('workout', workoutId)

      if (!cachedWorkout) {
        throw new Error('Тренировка не найдена в кэше')
      }

      const updatedWorkout = await $fetch<CreateWorkoutResponse>(API.FINISH_WORKOUT, {
        method: 'PUT',
        body: {
          workoutId,
          completed: true,
          sets: cachedWorkout.sets.map((set: UserTrainingSession) => ({
            exerciseId: set.exerciseId,
            weight: set.weight,
            repeats: set.repeats,
            difficulty: set.difficulty,
            completed: set.completed,
            setTime: set.setTime,
            setTimeAddedAt: set.setTimeAddedAt,
          })),
        },
      })

      await deleteCachedData('workout', workoutId)

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

      globalStats.value = null
      chartsState.value = null

      toast(t('toast.workout_completed'), ToastStatusesEnum.SUCCESS)
      await navigateTo('/')

      return updatedWorkout
    }
    catch (error: unknown) {
      console.error('Error finishing workout:', error)
      toast(t('toast.workout_ended'), ToastStatusesEnum.ERROR)
      return null
    }
    finally {
      isLoading.value = false
    }
  }

  return {
    finishWorkout,
    isLoading,
  }
}

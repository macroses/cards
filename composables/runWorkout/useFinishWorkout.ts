import type {
  ChartsApiResponse,
  CreateWorkoutResponse,
  Statistics,
  UserTrainingSession,
} from '~/ts/interfaces'
import { API, KEYS, PAGES } from '~/constants'
import { ToastStatusesEnum } from '~/ts/enums/toastStatuses.enum'
import { deleteCachedData, getCachedData } from '~/utils/cacheRunnedWorkout'
import { useWorkoutTimer } from '../workoutTimer/useWorkoutTimer'

/**
 * Composable for handling workout completion.
 * Saves final workout data, clears cache, updates global state, and redirects to home page.
 */

const CACHE_NAME = 'workout'

export function useFinishWorkout() {
  const workoutsList = useState<CreateWorkoutResponse[]>(KEYS.GLOBAL_WORKOUTS)
  const globalStats = useState<Statistics | null>(KEYS.GLOBAL_STATISTICS)
  const chartsState = useState<ChartsApiResponse | null>(KEYS.CHARTS_DATA)

  const { t } = useI18n()
  const { toast } = useToastState()
  const { stopTimer } = useWorkoutTimer()
  const { fetchWorkouts } = useFetchWorkoutsByUserId()
  const { checkPersonalRecords } = usePersonalRecords()
  const isLoading = shallowRef(false)

  async function finishWorkout(workoutId: string) {
    try {
      isLoading.value = true

      const cachedWorkout = await getCachedData(CACHE_NAME, workoutId)

      if (!cachedWorkout) {
        throw new Error(t('error.workout_not_in_cache'))
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

      await deleteCachedData(CACHE_NAME, workoutId)

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

      // Проверяем личные рекорды после завершения тренировки
      if (updatedWorkout && workoutsList.value) {
        checkPersonalRecords(updatedWorkout, workoutsList.value)
      }

      toast(t('toast.workout_completed'), ToastStatusesEnum.SUCCESS)
      await navigateTo(PAGES.HOME)

      return updatedWorkout
    }
    catch (error: unknown) {
      console.error(t('error.workout_finish'), error)
      return null
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

        await deleteCachedData(CACHE_NAME, runWorkoutId)
        await fetchWorkouts()
      }
      catch (error) {
        console.error('Error resetting workout:', error)
        toast(t('toast.workout_update_error'), ToastStatusesEnum.ERROR)
      }
    }
  }

  return {
    finishWorkout,
    resetNoTimeWorkout,
    isLoading,
  }
}

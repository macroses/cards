import type { TrainingSession } from '~/ts'
import type {
  ChartsApiResponse,
  CreateWorkoutResponse,
  Statistics,
} from '~/ts/interfaces'
import { API, KEYS, PAGES } from '~/constants'
import { ToastStatusesEnum } from '~/ts/enums/toastStatuses.enum'
import { deleteCachedData, getCachedData } from '~/utils/cacheRunnedWorkout'

/**
 * Composable for handling workout completion.
 * Saves final workout data, clears cache, updates global state, and redirects to home page.
 */

const CACHE_NAME = 'workout'
const ORIGINAL_CACHE_NAME = 'workout-original'

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

  function extractSetData(set: TrainingSession) {
    return ({
      exerciseId: set.exerciseId,
      weight: set.weight,
      repeats: set.repeats,
      difficulty: set.difficulty,
      completed: set.completed,
      setTime: set.setTime,
      setTimeAddedAt: set.setTimeAddedAt,
    })
  }

  function updateWorkoutsList(
    workoutId: string,
    updatedWorkout: CreateWorkoutResponse,
  ): void {
    if (!workoutsList.value) {
      return
    }

    workoutsList.value = workoutsList.value.map(workout => workout.id === workoutId
      ? { ...workout, endedAt: updatedWorkout.endedAt, completed: updatedWorkout.completed }
      : workout,
    )
  }

  function resetGlobalState() {
    stopTimer()
    globalStats.value = null
    chartsState.value = null
  }

  async function finishWorkout(workoutId: string): Promise<CreateWorkoutResponse | null> {
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
          sets: cachedWorkout.sets.map(extractSetData),
        },
      })

      await Promise.all([
        deleteCachedData(CACHE_NAME, workoutId),
        deleteCachedData(ORIGINAL_CACHE_NAME, workoutId),
      ])

      updateWorkoutsList(workoutId, updatedWorkout)
      resetGlobalState()

      if (updatedWorkout && workoutsList.value) {
        checkPersonalRecords(updatedWorkout, workoutsList.value)
      }

      toast(t('toast.workout_completed'), ToastStatusesEnum.SUCCESS)

      await fetchWorkouts()
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
    if (!runWorkoutId) {
      return
    }

    try {
      await $fetch(API.RESET_WORKOUT, {
        method: 'PUT',
        body: {
          workoutId: runWorkoutId,
        },
      })

      stopTimer()
      await navigateTo('/')

      await Promise.all([
        deleteCachedData(CACHE_NAME, runWorkoutId),
        deleteCachedData(ORIGINAL_CACHE_NAME, runWorkoutId),
      ])

      await fetchWorkouts()
    }
    catch (error) {
      console.error('Error resetting workout:', error)
      toast(t('toast.workout_update_error'), ToastStatusesEnum.ERROR)
    }
  }

  return {
    finishWorkout,
    resetNoTimeWorkout,
    isLoading,
  }
}

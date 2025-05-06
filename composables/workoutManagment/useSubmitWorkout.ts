import type {
  CreateWorkoutRequest,
  CreateWorkoutResponse,
  SubmitWorkoutReturn,
  UserWorkout,
} from '~/ts/interfaces'
import { API, KEYS, PAGES } from '~/constants'
import { ToastStatusesEnum } from '~/ts/enums/toastStatuses.enum'

/**
 * Composable for retrieving last exercise sets.
 * Finds and returns sets from the most recent workout for a given exercise.
 */

export function useSubmitWorkout(): SubmitWorkoutReturn {
  const { t } = useI18n()
  const { toast } = useToastState()
  const isLoading = shallowRef(false)

  const { fetchWorkouts } = useFetchWorkoutsByUserId()
  const workoutsList = useState<CreateWorkoutResponse[]>(KEYS.GLOBAL_WORKOUTS)

  const route = useRoute()
  const workoutId = route.query.edit as string

  function hasWorkoutChanged(newWorkout: UserWorkout): boolean {
    const originalWorkout = workoutsList.value.find(({ id }) => id === workoutId)

    if (!workoutId || !originalWorkout) {
      return true
    }

    const checks = [
      originalWorkout.title !== newWorkout.title,
      originalWorkout.color !== newWorkout.color,
      new Date(originalWorkout.workoutDate).getTime() !== new Date(newWorkout.workoutDate).getTime(),
      originalWorkout.exercises.length !== newWorkout.exercises.length,
      originalWorkout.sets.length !== newWorkout.sessions.length,
    ]

    if (checks.some(check => check)) {
      return true
    }

    const setsChanged = newWorkout.sessions.some((newSet) => {
      const originalSet = originalWorkout.sets.find(set =>
        set.exerciseId === newSet.exerciseId
        && set.weight === newSet.weight
        && set.repeats === newSet.repeats
        && set.difficulty === newSet.difficulty,
      )

      return !originalSet
    })

    return setsChanged
  }

  async function submitWorkout(workout: UserWorkout) {
    try {
      isLoading.value = true

      if (workoutId) {
        if (!hasWorkoutChanged(workout)) {
          navigateTo(PAGES.HOME)

          return true
        }

        await $fetch<CreateWorkoutRequest>(API.UPDATE_WORKOUT, {
          method: 'PUT',
          body: {
            ...workout,
            id: workoutId,
          },
        })
        toast(t('toast.workout_updated'), ToastStatusesEnum.SUCCESS)
      }
      else {
        await $fetch<CreateWorkoutRequest>(API.CREATE_WORKOUT, {
          method: 'POST',
          body: workout,
        })
        toast(t('toast.workout_created'), ToastStatusesEnum.SUCCESS)
      }

      navigateTo(PAGES.HOME)
      await fetchWorkouts()

      return true
    }
    catch (error: unknown) {
      console.error('Error submit workout', error)
      const errorMessage = workoutId ? t('error.workout_update_error') : t('error.workout_create_error')
      toast(errorMessage, ToastStatusesEnum.ERROR)
      return false
    }
    finally {
      isLoading.value = false
    }
  }

  return {
    submitWorkout,
    isLoading,
  }
}

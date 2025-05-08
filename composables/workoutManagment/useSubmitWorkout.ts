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

  function hasBasicPropertiesChanged(
    original: CreateWorkoutResponse,
    current: UserWorkout,
  ) {
    return (
      original.title !== current.title
      || original.color !== current.color
      || new Date(original.workoutDate).getTime() !== new Date(current.workoutDate).getTime()
      || original.exercises.length !== current.exercises.length
      || original.sets.length !== current.sessions.length
    )
  }

  function hasSetsChanged(original: CreateWorkoutResponse, current: UserWorkout): boolean {
    return current.sessions.some((newSet) => {
      const originalSet = original.sets.find(set =>
        set.exerciseId === newSet.exerciseId
        && set.weight === newSet.weight
        && set.repeats === newSet.repeats
        && set.difficulty === newSet.difficulty,
      )

      return !originalSet
    })
  }

  function hasWorkoutChanged(newWorkout: UserWorkout) {
    const originalWorkout = workoutsList.value.find(({ id }) => id === workoutId)

    if (!workoutId || !originalWorkout || hasBasicPropertiesChanged(originalWorkout, newWorkout)) {
      return true
    }

    return hasSetsChanged(originalWorkout, newWorkout)
  }

  async function createWorkout(workout: UserWorkout) {
    await $fetch<CreateWorkoutRequest>(API.CREATE_WORKOUT, {
      method: 'POST',
      body: workout,
    })

    toast(t('toast.workout_created'), ToastStatusesEnum.SUCCESS)

    return true
  }

  async function updateWorkout(workout: UserWorkout) {
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
    return true
  }

  async function submitWorkout(workout: UserWorkout): Promise<boolean> {
    try {
      isLoading.value = true

      const success = workoutId
        ? await updateWorkout(workout)
        : await createWorkout(workout)

      if (success) {
        navigateTo(PAGES.HOME)
        await fetchWorkouts()
      }

      return success
    }
    catch (error) {
      console.error('Error submitting workout', error)

      const errorMessage = workoutId
        ? t('error.workout_update_error')
        : t('error.workout_create_error')

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

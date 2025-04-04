import type {
  CreateWorkoutRequest,
  CreateWorkoutResponse,
  SubmitWorkoutReturn,
  UserWorkout,
} from '~/ts/interfaces'
import { API, GLOBAL_WORKOUTS } from '~/constants'
import { ToastStatusesEnum } from '~/ts/enums/toastStatuses.enum'

export function useSubmitWorkout(): SubmitWorkoutReturn {
  const { t } = useI18n()
  const { toast } = useToastState()
  const { fetchWorkouts } = useFetchWorkoutsByUserId()
  const route = useRoute()
  const isLoading = ref(false)
  const workoutId = route.query.edit as string
  const workoutsList = useState<CreateWorkoutResponse[] | []>(GLOBAL_WORKOUTS)

  function hasWorkoutChanged(newWorkout: UserWorkout): boolean {
    if (!workoutId)
      return true

    const originalWorkout = workoutsList.value.find(w => w.id === workoutId)

    if (!originalWorkout)
      return true

    if (
      originalWorkout.title !== newWorkout.title
      || originalWorkout.color !== newWorkout.color
      || new Date(originalWorkout.workoutDate).getTime() !== new Date(newWorkout.workoutDate).getTime()
    ) {
      return true
    }

    if (originalWorkout.exercises.length !== newWorkout.exercises.length) {
      return true
    }

    if (originalWorkout.sets.length !== newWorkout.sessions.length) {
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
          navigateTo('/')
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

      navigateTo('/')
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

import { GLOBAL_WORKOUTS } from '~/constants'
import type { CreateWorkoutRequest, CreateWorkoutResponse, SubmitWorkoutReturn, UserWorkout } from '~/ts/interfaces'

const API_CREATE = '/api/workout/create'
const API_UPDATE = '/api/workout/update'

export function useSubmitWorkout(): SubmitWorkoutReturn {
  const { t } = useI18n()
  const { toast } = useToastState()
  const { fetchWorkouts } = useFetchWorkoutsByUserId()
  const route = useRoute()
  const isLoading = ref(false)
  const workoutId = route.query.edit as string
  const workoutsList = useState<CreateWorkoutResponse[] | []>(GLOBAL_WORKOUTS)

  // Check if workout has changed
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
        // Проверяем, были ли изменения
        if (!hasWorkoutChanged(workout)) {
          navigateTo('/')
          return true
        }

        // Обновление существующей тренировки
        await $fetch<CreateWorkoutRequest>(API_UPDATE, {
          method: 'PUT',
          body: {
            ...workout,
            id: workoutId,
          },
        })
        toast(t('toast.workout_updated'), 'success')
      }
      else {
        // Создание новой тренировки
        await $fetch<CreateWorkoutRequest>(API_CREATE, {
          method: 'POST',
          body: workout,
        })
        toast(t('toast.workout_created'), 'success')
      }

      navigateTo('/')
      await fetchWorkouts()

      return true
    }
    catch (error: unknown) {
      console.error('Error submit workout', error)
      const errorMessage = workoutId ? t('error.workout_update_error') : t('error.workout_create_error')
      toast(errorMessage, 'error')
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

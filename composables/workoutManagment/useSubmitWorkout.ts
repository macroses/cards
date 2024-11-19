import type { CreateWorkoutRequest, UserWorkout } from '~/ts/interfaces'

interface SubmitWorkoutReturn {
  submitWorkout: (workout: UserWorkout) => Promise<boolean>
  isLoading: Ref<boolean>
}

const API_CREATE = '/api/workout/create'
const API_UPDATE = '/api/workout/update'

export function useSubmitWorkout(): SubmitWorkoutReturn {
  const { t } = useI18n()
  const { toast } = useToastState()
  const { fetchWorkouts } = useFetchWorkoutsByUserId()
  const route = useRoute()
  const isLoading = ref(false)
  const workoutId = route.query.edit as string

  async function submitWorkout(workout: UserWorkout) {
    try {
      isLoading.value = true

      if (workoutId) {
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

import type { CreateWorkoutResponse, UserWorkout } from '~/ts/interfaces'

const API_CREATE = '/api/workout/create'
const API_DELETE = '/api/workout/workout'
const API_UPDATE = '/api/workout/update-date'

export function useWorkout() {
  const { toast } = useToastState()
  const { t } = useI18n()
  const isLoading = ref(false)

  const workoutToCopy = ref<CreateWorkoutResponse | null>(null)
  const workoutToChangeDate = ref<CreateWorkoutResponse | null>(null)

  const isDateChangeMode = ref(false)
  const isCopyMode = ref(false)

  async function submitWorkout(workout: UserWorkout) {
    if (!workout.title) {
      toast(t('toast.enter_workout_name'), 'error')

      return false
    }

    if (!workout.exercises.length) {
      toast(t('toast.add_exercise'), 'error')

      return false
    }

    try {
      isLoading.value = true

      await $fetch(API_CREATE, {
        method: 'POST',
        body: workout,
      })

      toast(t('toast.workout_created'), 'success')
      return true
    }
    catch (error: unknown) {
      console.error('Error create workout', error)

      return false
    }
    finally {
      isLoading.value = false
    }
  }

  async function deleteWorkout(id: string) {
    try {
      isLoading.value = true

      await $fetch(API_DELETE, {
        method: 'DELETE',
        body: { id },
      })

      toast(t('toast.workout_deleted'), 'success')

      return true
    }
    catch (error: unknown) {
      console.error('Error delete workout', error)
      toast(t('toast.workout_delete_error'), 'error')

      return false
    }
    finally {
      isLoading.value = false
    }
  }

  async function copyWorkout(workout: CreateWorkoutResponse, date: Date) {
    const workoutCopy: UserWorkout = {
      title: workout.title,
      color: workout.color,
      workoutDate: date,
      exercises: workout.exercises.map(exercise => ({
        exerciseId: exercise.exerciseId,
        sets: [],
      })),
    }

    return await submitWorkout(workoutCopy)
  }

  function startCopyMode(workout: CreateWorkoutResponse) {
    isCopyMode.value = true
    workoutToCopy.value = workout
  }

  function cancelCopyMode() {
    isCopyMode.value = false
    workoutToCopy.value = null
  }

  async function updateWorkoutDate(id: string, newDate: Date) {
    try {
      isLoading.value = true

      await $fetch(API_UPDATE, {
        method: 'PATCH',
        body: {
          id,
          newDate,
        },
      })

      toast(t('toast.workout_date_changed'))

      return true
    }
    catch (error: unknown) {
      console.error('Ошибка при изменении даты тренировки:', error)

      toast(t('toast.workout_date_change_error'), 'error')

      return false
    }
    finally {
      isLoading.value = false
    }
  }

  function startDateChangeMode(workout: CreateWorkoutResponse) {
    isDateChangeMode.value = true
    workoutToChangeDate.value = workout
  }

  function cancelDateChangeMode() {
    isDateChangeMode.value = false
    workoutToChangeDate.value = null
  }

  return {
    submitWorkout,
    deleteWorkout,
    copyWorkout,
    startCopyMode,
    cancelCopyMode,
    isLoading,
    isCopyMode,
    workoutToCopy,
    updateWorkoutDate,
    startDateChangeMode,
    cancelDateChangeMode,
    isDateChangeMode,
    workoutToChangeDate,
  }
}

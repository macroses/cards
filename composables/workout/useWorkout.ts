import type { CreateWorkoutResponse } from '~/ts/interfaces/createWorkout.interface'
import type { UserWorkout } from '~/ts/interfaces/workoutUserTemplate.interface'

export function useWorkout() {
  const { toast } = useToastState()
  const isLoading = ref(false)
  const isCopyMode = ref(false)
  const workoutToCopy = ref<CreateWorkoutResponse | null>(null)
  const isDateChangeMode = ref(false)
  const workoutToChangeDate = ref<CreateWorkoutResponse | null>(null)

  async function submitWorkout(workout: UserWorkout) {
    if (!workout.title) {
      toast('Введите название тренировки', 'error')
      return false
    }

    if (!workout.exercises.length) {
      toast('Добавьте хотя бы одно упражнение', 'error')
      return false
    }

    try {
      isLoading.value = true
      await $fetch('/api/workout/create', {
        method: 'POST',
        body: workout,
      })

      toast('Тренировка успешно сохранена', 'success')
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
      await $fetch('/api/workout/workout', {
        method: 'DELETE',
        body: { id },
      })

      toast('Тренировка успешно удалена', 'success')

      return true
    }
    catch (error: unknown) {
      console.error('Error delete workout', error)
      toast('Ошибка при удалении тренировки', 'error')

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

      await $fetch('/api/workout/update-date', {
        method: 'PATCH',
        body: { id, newDate },
      })

      toast('Дата тренировки успешно изменена', 'success')

      return true
    }
    catch (error: unknown) {
      console.error('Ошибка при изменении даты тренировки:', error)
      toast('Ошибка при изменении даты тренировки', 'error')

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

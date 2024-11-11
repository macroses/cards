import type { IWorkout } from '~/types/GetWorkoutsResponse'
import type { Workout } from '~/types/Workout'

export function useWorkout() {
  const { toast } = useToastState()
  const isLoading = ref(false)
  const isCopyMode = ref(false)
  const workoutToCopy = ref<IWorkout | null>(null)

  async function submitWorkout(workout: Workout) {
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

  async function copyWorkout(workout: IWorkout, date: Date) {
    const workoutCopy: Workout = {
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

  function startCopyMode(workout: IWorkout) {
    isCopyMode.value = true
    workoutToCopy.value = workout
  }

  function cancelCopyMode() {
    isCopyMode.value = false
    workoutToCopy.value = null
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
  }
}

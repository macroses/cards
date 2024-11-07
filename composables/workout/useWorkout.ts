import type { Workout } from '~/types/Workout'

export function useWorkout() {
  const { toast } = useToastState()
  const isLoading = ref(false)

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
    catch (error: any) {
      console.log('Error create workout', error)
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
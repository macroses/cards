import type { CreateWorkoutResponse } from '~/ts/interfaces'
import { getCachedData } from '~/utils/cacheRunnedWorkout'

export function useRunWorkout() {
  const route = useRoute()
  const workoutId = route.params.id as string
  const workout = ref<CreateWorkoutResponse | null>(null)
  const isLoading = ref(true)
  const error = ref<string | null>(null)

  onMounted(async () => {
    if (!workoutId) {
      error.value = 'ID тренировки не указан'
      isLoading.value = false
      return
    }

    try {
      const cachedResult = await getCachedData('workout', workoutId)

      if (cachedResult) {
        workout.value = cachedResult
      }
      else {
        error.value = 'Тренировка не найдена в кэше'
      }
    }
    catch (e: any) {
      error.value = 'Ошибка при получении данных тренировки'
    }
    finally {
      isLoading.value = false
    }
  })

  return {
    workout,
    isLoading,
    error,
  }
}

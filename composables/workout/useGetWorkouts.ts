import type { GetWorkoutsResponse } from '~/types/GetWorkoutsResponse'

export function useGetWorkouts() {
  const workouts = useState<GetWorkoutsResponse[] | null>('globalWorkouts', () => null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  async function fetchWorkouts() {
    try {
      isLoading.value = true
      workouts.value = await $fetch<GetWorkoutsResponse[]>('/api/workout/workouts')
    }
    catch (e: unknown) {
      console.error('Ошибка при получении тренировок:', e)
      error.value = 'Не удалось загрузить тренировки'
      workouts.value = null
    }
    finally {
      isLoading.value = false
    }
  }

  return {
    workouts,
    isLoading,
    error,
    fetchWorkouts,
  }
}

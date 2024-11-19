import type { WorkoutSet } from '@prisma/client'

const API_LAST_SETS = '/api/workout/getLastExerciseSets'

export function useLastExerciseSets() {
  const lastSets = ref<WorkoutSet[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  async function fetchLastSets(exerciseId: number, currentDate: Date) {
    try {
      isLoading.value = true

      lastSets.value = await $fetch<WorkoutSet[]>(API_LAST_SETS, {
        query: {
          exerciseId,
          currentDate: currentDate.toISOString(),
        },
      })
    }
    catch (err) {
      console.error('Ошибка при загрузке предыдущих результатов:', err)
      error.value = 'Ошибка при загрузке предыдущих результатов'
      lastSets.value = []
    }
    finally {
      isLoading.value = false
    }
  }

  return {
    lastSets,
    isLoading,
    error,
    fetchLastSets,
  }
}

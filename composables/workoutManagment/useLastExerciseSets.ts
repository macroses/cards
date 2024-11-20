import type { WorkoutSet } from '@prisma/client'

const API_LAST_SETS = '/api/workout/getLastExerciseSets'
const GLOBAL_LAST_SETS = 'global-last-sets'

export function useLastExerciseSets() {
  const lastSets = useState<Record<number, WorkoutSet[]>>(GLOBAL_LAST_SETS, () => ({}))
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  async function fetchLastSets(exerciseId: number, currentDate: Date) {
    try {
      isLoading.value = true

      const sets = await $fetch<WorkoutSet[]>(API_LAST_SETS, {
        query: {
          exerciseId,
          currentDate: currentDate.toISOString(),
        },
      })

      lastSets.value[exerciseId] = sets
    }
    catch (err) {
      console.error('Ошибка при загрузке предыдущих результатов:', err)
      error.value = 'Ошибка при загрузке предыдущих результатов'
      lastSets.value[exerciseId] = []
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

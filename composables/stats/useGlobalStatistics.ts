import type { CreateWorkoutResponse, Statistics } from '~/ts/interfaces'
import { API, CACHE_TIMES, KEYS } from '~/constants'

/**
 * Composable for managing global workout statistics.
 * Handles data fetching, caching, and state management with 5-minute cache duration.
 */
export function useGlobalStatistics() {
  const globalStats = useState<Statistics | null>(KEYS.GLOBAL_STATISTICS, () => null)
  const workouts = useState<CreateWorkoutResponse[] | null>(KEYS.GLOBAL_WORKOUTS)

  const {
    data: statistics,
    error,
    refresh,
  } = useCachedFetch<unknown, Statistics>({
    url: API.GLOBAL_STATISTICS,
    key: KEYS.GLOBAL_STATISTICS,
    transform: payload => payload as Statistics,
    initialData: globalStats.value,
    cacheTime: CACHE_TIMES.STATISTICS,
    immediate: false,
  })

  watch(statistics, (newStats) => {
    if (newStats) {
      globalStats.value = newStats
    }
  })
  watch(() => workouts.value?.length, () => refresh())

  return {
    statistics: computed(() => globalStats.value || statistics.value),
    error,
    refresh,
  }
}

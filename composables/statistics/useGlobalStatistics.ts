import type { Statistics } from '~/ts/interfaces'
import { API, CACHE_TIMES, KEYS } from '~/constants'

/**
 * Composable for managing global workout statistics.
 * Handles data fetching, caching, and state management with 5-minute cache duration.
 */
export function useGlobalStatistics() {
  const globalStats = useState<Statistics | null>(KEYS.GLOBAL_STATISTICS, () => null)
  const {
    data: statistics,
    error,
    status,
    refresh,
  } = useCachedFetch<unknown, Statistics>({
    url: API.GLOBAL_STATISTICS,
    key: KEYS.GLOBAL_STATISTICS,
    transform: payload => payload as Statistics,
    initialData: globalStats.value,
    cacheTime: CACHE_TIMES.STATISTICS,
  })

  watch(statistics, newStats => newStats && (globalStats.value = newStats))

  const isLoading = computed(() => status.value === 'pending')

  onMounted(() => !globalStats.value && refresh())

  return {
    statistics: computed(() => globalStats.value || statistics.value),
    isLoading,
    error,
    refresh,
  }
}

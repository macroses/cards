import type { Statistics } from '~/ts/interfaces'
import { API, KEYS } from '~/constants'

const CACHE_TIME = 1000 * 60 * 5

/**
 * Composable for managing global workout statistics.
 * Handles data fetching, caching, and state management with 5-minute cache duration.
 */
export function useGlobalStatistics() {
  const globalStats = useState<Statistics | null>(KEYS.GLOBAL_STATISTICS, () => null)
  const isInitialFetch = ref(!globalStats.value)

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
    cacheTime: CACHE_TIME,
  })

  watch(statistics, (newStats) => {
    if (newStats) {
      globalStats.value = newStats
    }
  })

  const isLoading = computed(() => status.value === 'pending')

  onMounted(async () => {
    if (isInitialFetch.value) {
      await refresh()
      isInitialFetch.value = false
    }
  })

  return {
    statistics: computed(() => globalStats.value || statistics.value),
    isLoading,
    error,
    refresh,
  }
}

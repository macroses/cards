import { API_GLOBAL_STATISTICS } from '~/constants'
import type { Statistics } from '~/ts/interfaces'

export function useGlobalStatistics() {
  const statistics = ref<Statistics | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  async function fetchStatistics() {
    try {
      isLoading.value = true
      statistics.value = await $fetch<Statistics>(API_GLOBAL_STATISTICS)
    }
    catch (err) {
      console.error('Ошибка при загрузке статистики:', err)
      error.value = 'Ошибка при загрузке статистики'
    }
    finally {
      isLoading.value = false
    }
  }

  onMounted(() => fetchStatistics())

  return {
    statistics,
    isLoading,
    error,
    fetchStatistics,
  }
}

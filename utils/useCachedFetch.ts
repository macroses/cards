interface CachedFetchOptions<T, R> {
  url: string
  key: string
  transform: (data: T) => R
  cacheTime?: number
  initialData?: R
}

interface CachedData<T> {
  data: T
  fetchedAt: Date
}

const DEFAULT_CACHE_TIME = 1000 * 60 * 60 * 24

export function useCachedFetch<T, R>({
  url,
  key,
  transform,
  cacheTime = DEFAULT_CACHE_TIME,
  initialData,
}: CachedFetchOptions<T, R>) {
  const nuxtApp = useNuxtApp()

  const { data, error, status, refresh } = useLazyFetch<CachedData<R>>(url, {
    key,
    transform: (payload: unknown) => ({
      data: transform(payload as T),
      fetchedAt: new Date(),
    }),
    getCachedData: (cacheKey: string) => {
      const cached = nuxtApp.payload.data[cacheKey] || nuxtApp.static.data[cacheKey]

      if (!cached) {
        return
      }

      const expiration = new Date(cached.fetchedAt)
      expiration.setTime(expiration.getTime() + cacheTime)

      if (expiration.getTime() < Date.now()) {
        return
      }

      return cached as CachedData<R>
    },
    default: () => ({
      data: initialData as R,
      fetchedAt: new Date(),
    }),
  })

  return {
    data: computed(() => data.value?.data),
    status,
    error,
    refresh,
  }
}

const CACHE_NAME = 'workout-cache-v1'

function getCacheKey(cacheName: string, id: string) {
  return new URL(`${cacheName}-${id}`, window.location.origin).toString()
}

export async function saveCacheData(cacheName: string, data: any) {
  try {
    const cache = await caches.open(CACHE_NAME)
    const cacheKey = getCacheKey(cacheName, data.id)

    const response = new Response(JSON.stringify(data), {
      headers: {
        'Content-Type': 'application/json',
      },
    })

    await cache.put(cacheKey, response)
  }
  catch (error) {
    console.error('Error caching data:', error)
  }
}

export async function getCachedData(cacheName: string, id: string) {
  try {
    const cache = await caches.open(CACHE_NAME)
    const cacheKey = getCacheKey(cacheName, id)

    const response = await cache.match(cacheKey)

    if (response) {
      return response.json()
    }

    return null
  }
  catch (error) {
    console.error('Error getting cached data:', error)
    return null
  }
}

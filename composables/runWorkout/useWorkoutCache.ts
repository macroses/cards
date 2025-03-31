import type { CreateWorkoutResponse } from '~/ts/interfaces'

const CACHE_NAME = 'workout-cache'
const WORKOUT_KEY = 'current-workout'

export function useWorkoutCache() {
  const cache = ref<Cache | null>(null)

  const initCache = async () => {
    try {
      cache.value = await caches.open(CACHE_NAME)
    }
    catch (error) {
      console.error('Error initializing cache:', error)
    }
  }

  const saveWorkout = async (workout: CreateWorkoutResponse) => {
    if (!cache.value)
      await initCache()
    if (!cache.value)
      return

    try {
      await cache.value.put(
        WORKOUT_KEY,
        new Response(JSON.stringify(workout), {
          headers: { 'Content-Type': 'application/json' },
        }),
      )
    }
    catch (error) {
      console.error('Error saving workout to cache:', error)
    }
  }

  const getWorkout = async (): Promise<CreateWorkoutResponse | null> => {
    if (!cache.value)
      await initCache()
    if (!cache.value)
      return null

    try {
      const response = await cache.value.match(WORKOUT_KEY)
      if (!response)
        return null
      return await response.json()
    }
    catch (error) {
      console.error('Error getting workout from cache:', error)
      return null
    }
  }

  const clearCache = async () => {
    if (!cache.value)
      await initCache()
    if (!cache.value)
      return

    try {
      await cache.value.delete(WORKOUT_KEY)
    }
    catch (error) {
      console.error('Error clearing cache:', error)
    }
  }

  return {
    saveWorkout,
    getWorkout,
    clearCache,
  }
}

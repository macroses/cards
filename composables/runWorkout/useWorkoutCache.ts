import type { CreateWorkoutResponse } from '~/ts/interfaces'

const CACHE_NAME = 'workout-cache'
const WORKOUT_KEY = 'current-workout'

export function useWorkoutCache() {
  const cache = ref<Cache | null>(null)

  async function initCache() {
    try {
      cache.value = await caches.open(CACHE_NAME)
      return true
    }
    catch (error) {
      console.error('Error initializing cache:', error)
      return false
    }
  }

  async function ensureCache() {
    if (!cache.value) {
      return await initCache()
    }

    return true
  }

  async function saveWorkout(workout: CreateWorkoutResponse) {
    if (!await ensureCache()) {
      return
    }

    try {
      await cache.value!.put(
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

  async function getWorkout(): Promise<CreateWorkoutResponse | null> {
    if (!await ensureCache()) {
      return null
    }

    try {
      const response = await cache.value!.match(WORKOUT_KEY)

      if (!response) {
        return null
      }

      return await response.json()
    }
    catch (error) {
      console.error('Error getting workout from cache:', error)
      return null
    }
  }

  async function clearCache() {
    if (!await ensureCache()) {
      return
    }

    try {
      await cache.value!.delete(WORKOUT_KEY)
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

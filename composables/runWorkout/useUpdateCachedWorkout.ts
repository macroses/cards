import type { CreateWorkoutResponse } from '~/ts/interfaces'
import { saveCacheData } from '~/utils/cacheRunnedWorkout'

export function useUpdateCachedWorkout() {
  async function updateSetField(
    workout: CreateWorkoutResponse,
    setId: string,
    field: 'weight' | 'repeats' | 'difficulty',
    value: number | string,
  ): Promise<boolean> {
    try {
      const updatedWorkout = {
        ...workout,
        sets: workout.sets.map(set =>
          set.id === setId
            ? { ...set, [field]: value }
            : set,
        ),
      }

      await saveCacheData('workout', updatedWorkout)

      // Обновляем состояние workout
      workout.sets = updatedWorkout.sets

      return true
    }
    catch (error) {
      console.error('Error updating cached workout:', error)
      return false
    }
  }

  return {
    updateSetField,
  }
}

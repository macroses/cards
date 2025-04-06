import type { CreateWorkoutResponse } from '~/ts/interfaces'
import type { UnionSetFields } from '~/ts/types/setFields.types'
import { saveCacheData } from '~/utils/cacheRunnedWorkout'

/**
 * Composable for updating cached workout.
 * Finds set by id, updates set field, and saves updated workout to cache.
 */

export function useUpdateCachedWorkout() {
  async function updateSetField(
    workout: CreateWorkoutResponse,
    setId: string,
    field: UnionSetFields,
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

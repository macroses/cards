import type { WorkoutResponse } from '~/ts'
import type { UnionSetFields } from '~/ts/types/setFields.types'
import { saveCacheData } from '~/utils/cacheRunnedWorkout'

/**
 * Composable for updating cached workout.
 * Finds set by id, updates set field, and saves updated workout to cache.
 */

export function useUpdateCachedWorkout() {
  async function updateSetField(
    workout: WorkoutResponse,
    setId: string,
    field: UnionSetFields,
    value: number | string,
  ) {
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
    }
    catch (error) {
      console.error('Error updating cached workout:', error)
    }
  }

  return {
    updateSetField,
  }
}

import type { CreateWorkoutResponse, UserTrainingSession } from '~/ts/interfaces'
import { nanoid } from 'nanoid'
import { DIFFICULT_LEVEL } from '~/ts/enums/workoutColors.enum'
import { saveCacheData } from '~/utils/cacheRunnedWorkout'

/**
 * Composable for managing workout sets.
 * Provides functions for adding and deleting sets with caching.
 */

const MAX_SETS_COUNT = 50

export function useManageSets() {
  async function addSet(
    workout: CreateWorkoutResponse,
    exerciseId: string,
  ): Promise<boolean> {
    try {
      const exerciseSets = workout.sets.filter(set => set.exerciseId === exerciseId)

      if (exerciseSets.length >= MAX_SETS_COUNT) {
        return false
      }

      const newSet: UserTrainingSession = {
        id: nanoid(),
        exerciseId,
        weight: 0,
        repeats: 0,
        difficulty: DIFFICULT_LEVEL.WARM,
        completed: false,
        setTime: null,
        setTimeAddedAt: null,
      }

      const updatedWorkout = {
        ...workout,
        sets: [...workout.sets, newSet],
      }

      await saveCacheData('workout', updatedWorkout)
      workout.sets = updatedWorkout.sets

      return true
    }
    catch (error) {
      console.error('Error adding set to cached workout:', error)
      return false
    }
  }

  async function deleteSet(
    workout: CreateWorkoutResponse,
    setId: string,
  ): Promise<boolean> {
    try {
      const exerciseId = workout.sets.find(set => set.id === setId)?.exerciseId
      if (!exerciseId) {
        return false
      }

      const exerciseSets = workout.sets.filter(set => set.exerciseId === exerciseId)

      if (exerciseSets.length === 1) {
        return false
      }

      const updatedWorkout = {
        ...workout,
        sets: workout.sets.filter(set => set.id !== setId),
      }

      await saveCacheData('workout', updatedWorkout)
      workout.sets = updatedWorkout.sets

      return true
    }
    catch (error) {
      console.error('Error deleting set from cached workout:', error)
      return false
    }
  }

  return {
    addSet,
    deleteSet,
  }
}

import type { CreateWorkoutResponse, UserTrainingSession } from '~/ts/interfaces'
import { nanoid } from 'nanoid'
import { DIFFICULT_LEVEL } from '~/ts/enums/workoutColors.enum'
import { saveCacheData } from '~/utils/cacheRunnedWorkout'

/**
 * Composable for managing workout sets.
 * Provides functions for adding and deleting sets with caching.
 */

const MAX_SETS_COUNT = 50
const CACHE_KEY = 'workout'

export function useManageSets() {
  async function updateWorkoutAndCache(
    workout: CreateWorkoutResponse,
    newSets: UserTrainingSession[],
  ) {
    try {
      const updatedWorkout = { ...workout, sets: newSets }
      await saveCacheData(CACHE_KEY, updatedWorkout)
      workout.sets = updatedWorkout.sets

      return true
    }
    catch (error) {
      console.error('Error updating cached workout:', error)
      return false
    }
  }

  const createNewSet = (exerciseId: string): UserTrainingSession => ({
    id: nanoid(),
    exerciseId,
    weight: 0,
    repeats: 0,
    difficulty: DIFFICULT_LEVEL.WARM,
    completed: false,
    setTime: null,
    setTimeAddedAt: null,
  })

  function getExerciseSets(workout: CreateWorkoutResponse, exerciseId: string) {
    return workout.sets.filter(set => set.exerciseId === exerciseId)
  }

  async function addSet(
    workout: CreateWorkoutResponse,
    exerciseId: string,
  ) {
    const exerciseSets = getExerciseSets(workout, exerciseId)

    if (exerciseSets.length >= MAX_SETS_COUNT) {
      return false
    }

    const newSet = createNewSet(exerciseId)
    return updateWorkoutAndCache(workout, [...workout.sets, newSet])
  }

  async function deleteSet(
    workout: CreateWorkoutResponse,
    setId: string,
  ) {
    const targetSet = workout.sets.find(({ id }) => id === setId)

    if (!targetSet) {
      return false
    }

    const exerciseSets = getExerciseSets(workout, targetSet.exerciseId)

    if (exerciseSets.length <= 1) {
      return false
    }

    const updatedSets = workout.sets.filter(({ id }) => id !== setId)

    return updateWorkoutAndCache(workout, updatedSets)
  }

  return {
    addSet,
    deleteSet,
  }
}

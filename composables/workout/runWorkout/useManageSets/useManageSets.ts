import type { TrainingSession, WorkoutResponse } from '~/ts'
import { nanoid } from 'nanoid'
import { DEFAULT_SET_VALUES, WORKOUT_CACHE_KEYS, WORKOUT_LIMITS } from '~/constants'
import { DIFFICULT_LEVEL } from '~/ts/enums/workoutColors.enum'
import { saveCacheData } from '~/utils/cacheRunnedWorkout'

/**
 * Composable for managing workout sets.
 * Provides functions for adding and deleting sets with caching.
 */

export function useManageSets() {
  async function updateWorkoutAndCache(
    workout: WorkoutResponse,
    newSets: TrainingSession[],
  ) {
    try {
      const updatedWorkout = { ...workout, sets: newSets }
      await saveCacheData(WORKOUT_CACHE_KEYS.WORKOUT, updatedWorkout)
      workout.sets = updatedWorkout.sets

      return true
    }
    catch (error) {
      console.error('Error updating cached workout:', error)
      return false
    }
  }

  const createNewSet = (exerciseId: string): TrainingSession => ({
    id: nanoid(),
    exerciseId,
    weight: DEFAULT_SET_VALUES.WEIGHT,
    repeats: DEFAULT_SET_VALUES.REPEATS,
    difficulty: DIFFICULT_LEVEL.WARM,
    completed: false,
    setTime: null,
    setTimeAddedAt: null,
  })

  function getExerciseSets(workoutSets: TrainingSession[], exerciseId: string) {
    return workoutSets.filter(set => set.exerciseId === exerciseId)
  }

  async function addSet(
    workout: WorkoutResponse,
    exerciseId: string,
  ) {
    const exerciseSets = getExerciseSets(workout.sets, exerciseId)

    if (exerciseSets.length >= WORKOUT_LIMITS.MAX_SETS_COUNT) {
      return false
    }

    const newSet = createNewSet(exerciseId)
    return updateWorkoutAndCache(workout, [...workout.sets, newSet])
  }

  async function deleteSet(
    workout: WorkoutResponse,
    setId: string,
  ) {
    const targetSet = workout.sets.find(({ id }) => id === setId)

    if (!targetSet) {
      return false
    }

    const exerciseSets = getExerciseSets(workout.sets, targetSet.exerciseId)

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

import type { CreateWorkoutResponse } from '~/ts/interfaces'

/**
 * Composable for grouping workout sets by exercise.
 * Groups sets by exercise ID and adds exercise name to each group.
 */
export function useExerciseSets() {
  function getExerciseSets(workout: CreateWorkoutResponse | null) {
    if (!workout) {
      return {}
    }

    return workout.sets.reduce((acc, set) => {
      const exerciseId = set.exerciseId

      if (!acc[exerciseId]) {
        acc[exerciseId] = {
          sets: [],
          name: workout?.exercises.find(e => e.exerciseId === exerciseId)?.exerciseName || 'Unknown',
        }
      }
      acc[exerciseId].sets.push(set)

      return acc
    }, {} as Record<string, { sets: CreateWorkoutResponse['sets'], name: string }>)
  }

  return {
    getExerciseSets,
  }
}

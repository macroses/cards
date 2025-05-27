import type { TrainingSession } from '~/ts'
import type { CreateWorkoutResponse } from '~/ts/interfaces'

interface ExerciseSetGroup {
  sets: TrainingSession[]
  name: string
}

/**
 * Composable for grouping workout sets by exercise.
 * Groups sets by exercise ID and adds exercise name to each group.
 */
export function useExerciseSets() {
  function findExerciseName(exerciseId: string, exercises: CreateWorkoutResponse['exercises']): string {
    return exercises.find(exercise => exercise.exerciseId === exerciseId)?.exerciseName || 'Unknown'
  }

  function getExerciseSets(workout: CreateWorkoutResponse | null) {
    if (!workout) {
      return {}
    }

    const { sets, exercises } = workout
    const exerciseSetsMap: Record<string, ExerciseSetGroup> = {}

    for (const set of sets) {
      const { exerciseId } = set

      if (!exerciseSetsMap[exerciseId]) {
        exerciseSetsMap[exerciseId] = {
          sets: [],
          name: findExerciseName(exerciseId, exercises),
        }
      }

      exerciseSetsMap[exerciseId].sets.push(set)
    }

    return exerciseSetsMap
  }

  return {
    getExerciseSets,
  }
}

import type { CreateWorkoutResponse, UserTrainingSession } from '~/ts/interfaces'
import { GLOBAL_WORKOUTS } from '~/constants'

/**
 * Composable for managing last exercise sets.
 * Retrieves and stores last sets for each exercise.
 */

export function useLastExerciseSets() {
  const workouts = useState<CreateWorkoutResponse[] | null>(GLOBAL_WORKOUTS)
  const lastSets = ref<Record<string, UserTrainingSession[]>>({})

  function getLastSets(exerciseId: string, currentDate: Date): void {
    const lastWorkout = workouts.value
      ?.filter(workout =>
        workout.exercises.some(ex => ex.exerciseId === exerciseId)
        && new Date(workout.workoutDate) < currentDate,
      )
      .sort((a, b) =>
        new Date(b.workoutDate).getTime() - new Date(a.workoutDate).getTime(),
      )[0]

    lastSets.value[exerciseId] = lastWorkout?.sets
      ?.filter(set => set.exerciseId === exerciseId)
      ?.sort((a, b) => a.id.localeCompare(b.id)) ?? []
  }

  return {
    lastSets,
    getLastSets,
  }
}

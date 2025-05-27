import type { TrainingSession } from '~/ts'
import type { CreateWorkoutResponse } from '~/ts/interfaces'
import { KEYS } from '~/constants'

/**
 * Composable for managing last exercise sets.
 * Retrieves and stores last sets for each exercise.
 */

export function useLastExerciseSets() {
  const workouts = useState<CreateWorkoutResponse[]>(KEYS.GLOBAL_WORKOUTS)
  const lastSets = ref<Record<string, TrainingSession[]>>({})

  function extractExerciseSets(
    workout: CreateWorkoutResponse,
    exerciseId: string,
  ): TrainingSession[] {
    return workout.sets
      ?.filter(set => set.exerciseId === exerciseId)
      ?.sort((a, b) => a.id.localeCompare(b.id)) ?? []
  }

  function findLastWorkoutWithExercise(
    identifier: string,
    currentDate: Date,
  ) {
    return workouts.value
      .filter((workout) => {
        const hasExercise = workout.exercises.some(({ exerciseId }) => exerciseId === identifier)
        const isBeforeCurrentDate = new Date(workout.workoutDate) < currentDate

        return hasExercise && isBeforeCurrentDate
      })
      .sort((a, b) => new Date(b.workoutDate).getTime() - new Date(a.workoutDate).getTime())[0]
  }

  function getLastSets(
    exerciseId: string,
    currentDate: Date,
  ) {
    if (!workouts.value?.length) {
      lastSets.value[exerciseId] = []

      return
    }

    const lastWorkout = findLastWorkoutWithExercise(exerciseId, currentDate)

    lastSets.value[exerciseId] = lastWorkout
      ? extractExerciseSets(lastWorkout, exerciseId)
      : []
  }

  return {
    lastSets,
    getLastSets,
  }
}

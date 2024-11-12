import { MAX_LENGTH } from '~/constants/strings'
import type { UserTrainingSession, UserWorkoutExercise } from '~/ts/interfaces/workoutUserTemplate.interface'

export function useWorkoutExercises(workoutExercises: UserWorkoutExercise[]) {
  const isWorkoutSetValid = ref(false)

  const workoutSetRules = [
    createValidationRule(MAX_LENGTH, 5),
  ]

  function workoutExercisesLength<T>(id: T): number {
    return workoutExercises.find((exercise: UserWorkoutExercise) => exercise.exerciseId === id)?.sets.length || 0
  }

  function calculateTonnage<T>(exerciseId: T): number {
    const exercise = workoutExercises.find(
      (exercise: UserWorkoutExercise) => exercise.exerciseId === exerciseId,
    )

    if (!exercise) {
      return 0
    }

    return exercise.sets.reduce((total: number, set: UserTrainingSession) => total + (set.weight * set.repeats), 0)
  }

  const totalTonnage = computed(() => {
    return workoutExercises.reduce((total: number, exercise: UserWorkoutExercise) => {
      return total + exercise.sets.reduce((exerciseTotal: number, set: UserTrainingSession) => {
        return exerciseTotal + (set.weight * set.repeats)
      }, 0)
    }, 0)
  })

  return {
    isWorkoutSetValid,
    workoutSetRules,
    workoutExercisesLength,
    calculateTonnage,
    totalTonnage,
  }
}

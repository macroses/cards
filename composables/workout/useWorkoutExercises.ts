import type { WorkoutExerciseWithSets, WorkoutSet } from '~/types/Workout'

export function useWorkoutExercises(workoutExercises: WorkoutExerciseWithSets[]) {
  const isWorkoutSetValid = ref(false)

  const workoutSetRules = [
    createValidationRule('maxLength', 5),
  ]

  function workoutExercisesLength(id: number): number {
    return workoutExercises.find(
      (exercise: WorkoutExerciseWithSets) => exercise.exerciseId === id,
    )?.sets.length || 0
  }

  function calculateTonnage(exerciseId: number): number {
    const exercise = workoutExercises.find(
      (exercise: WorkoutExerciseWithSets) => exercise.exerciseId === exerciseId,
    )

    if (!exercise)
      return 0

    return exercise.sets.reduce((total: number, set: WorkoutSet) => total + (set.weight * set.repeats), 0)
  }

  const totalTonnage = computed(() => {
    return workoutExercises.reduce((total: number, exercise: WorkoutExerciseWithSets) => {
      return total + exercise.sets.reduce((exerciseTotal: number, set: WorkoutSet) => {
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

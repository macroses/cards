import type { Workout, WorkoutSet } from '~/types/Workout'

export function useWorkoutSets(workout: Workout, exerciseData: Map<any, any>) {
  function addSet(exerciseId: number) {
    const data = exerciseData.get(exerciseId)
    if (data?.currentWeight && data?.currentRepeats) {
      const newSet: WorkoutSet = {
        id: crypto.randomUUID(),
        weight: Number(data.currentWeight),
        repeats: Number(data.currentRepeats),
        difficulty: data.currentDifficulty || 1,
      }

      const exerciseIndex = workout.exercises.findIndex(e => e.exerciseId === exerciseId)
      if (exerciseIndex === -1) {
        workout.exercises.push({
          exerciseId,
          sets: [newSet],
        })
      }
      else {
        workout.exercises[exerciseIndex].sets.push(newSet)
      }
    }
  }

  function getExerciseSets(exerciseId: number) {
    const exercise = workout.exercises.find(e => e.exerciseId === exerciseId)
    return exercise?.sets || []
  }

  function removeSet(exerciseId: number, setId: string) {
    const exerciseIndex = workout.exercises.findIndex(e => e.exerciseId === exerciseId)
    if (exerciseIndex !== -1) {
      const exercise = workout.exercises[exerciseIndex]
      exercise.sets = exercise.sets.filter(set => set.id !== setId)

      if (exercise.sets.length === 0)
        workout.exercises.splice(exerciseIndex, 1)
    }
  }

  return {
    addSet,
    getExerciseSets,
    removeSet,
  }
}

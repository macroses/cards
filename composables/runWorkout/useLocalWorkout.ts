import type { CreateWorkoutResponse } from '~/ts/interfaces'

export function useLocalWorkout() {
  const localWorkout = useLocalStorage<CreateWorkoutResponse | null>(
    'current-workout',
    null,
    {
      serializer: {
        read: (v: any) => {
          try {
            return v ? JSON.parse(v) : null
          }
          catch (e) {
            console.error('Error parsing localStorage:', e)
            return null
          }
        },
        write: (v: any) => JSON.stringify(v),
      },
    },
  )

  function saveWorkout(workout: CreateWorkoutResponse) {
    if (!workout.sets) {
      workout.sets = []
    }

    localWorkout.value = { ...workout }
  }

  interface WorkoutSet {
    id: string
    workoutId: string
    exerciseId: string
    weight: number
    repeats: number
    difficulty: number
    completed: boolean
    setTime: number | null
    setTimeAddedAt?: string | null
  }

  function updateSet(updatedSet: WorkoutSet) {
    if (!localWorkout.value) {
      return
    }

    if (!localWorkout.value.sets) {
      localWorkout.value.sets = []
    }

    const setExists = localWorkout.value.sets.some(set => set.id === updatedSet.id)

    if (!setExists) {
      const newSet: WorkoutSet = {
        id: updatedSet.id,
        workoutId: localWorkout.value.id,
        exerciseId: updatedSet.exerciseId ?? '',
        weight: updatedSet.weight ?? 0,
        repeats: updatedSet.repeats ?? 0,
        difficulty: updatedSet.difficulty ?? 1,
        completed: updatedSet.completed ?? false,
        setTime: updatedSet.setTime ?? null,
      }

      localWorkout.value = {
        ...localWorkout.value,
        sets: [...localWorkout.value.sets, newSet],
      }
    }
    else {
      localWorkout.value = {
        ...localWorkout.value,
        sets: localWorkout.value.sets.map(set =>
          set.id === updatedSet.id
            ? { ...set, ...updatedSet, workoutId: set.workoutId }
            : set,
        ),
      }
    }
  }

  function addSet(newSet: Omit<WorkoutSet, 'workoutId'>) {
    if (!localWorkout.value) {
      return
    }

    if (!localWorkout.value.sets) {
      localWorkout.value.sets = []
    }

    const setWithWorkoutId: WorkoutSet = {
      ...newSet,
      workoutId: localWorkout.value.id,
    }

    localWorkout.value = {
      ...localWorkout.value,
      sets: [...localWorkout.value.sets, setWithWorkoutId],
    }
  }

  function clearWorkout() {
    localWorkout.value = null
  }

  return {
    localWorkout,
    saveWorkout,
    updateSet,
    addSet,
    clearWorkout,
  }
}

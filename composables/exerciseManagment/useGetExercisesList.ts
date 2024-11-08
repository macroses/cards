import type { Exercise } from '~/types/Exercise'

interface ExerciseGroup {
  primary: string
  exercises: Exercise[]
}

export function useGetExercisesList() {
  const { data: exercisesList } = useAsyncData<ExerciseGroup[]>(
    'get-exercises-list',
    () => $fetch('/api/exercises/exercises'),
  )

  return { exercisesList }
}

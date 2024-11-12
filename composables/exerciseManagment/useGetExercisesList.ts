import type { ExerciseServerTemplate } from '~/ts/interfaces/ExerciseServerTemplate.interface'

interface ExerciseGroup {
  primary: string
  exercises: ExerciseServerTemplate[]
}

export function useGetExercisesList() {
  const { data: exercisesList } = useAsyncData<ExerciseGroup[]>(
    'get-exercises-list',
    () => $fetch('/api/exercises/exercises'),
  )

  return { exercisesList }
}

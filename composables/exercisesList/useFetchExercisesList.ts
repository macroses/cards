const API_EXERCISES_LIST_URL = '/api/exercises/exercises'

export function useFetchExercisesList() {
  const { data: exercisesList } = useAsyncData(
    'get-exercises-list',
    () => $fetch(API_EXERCISES_LIST_URL),
  )

  return { exercisesList }
}

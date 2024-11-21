const API_EXERCISES_LIST_URL = '/api/exercises/exercises'
const KEY_EXERCISES_LIST = 'get-exercises-list'

export function useFetchExercisesList() {
  const { data: exercisesList } = useAsyncData(
    KEY_EXERCISES_LIST,
    () => $fetch(API_EXERCISES_LIST_URL),
  )

  return { exercisesList }
}

import { API_EXERCISES_LIST_URL, KEY_EXERCISES_LIST } from '~/constants'

export function useFetchExercisesList() {
  const { data: exercisesList } = useAsyncData(
    KEY_EXERCISES_LIST,
    () => $fetch(API_EXERCISES_LIST_URL),
  )

  return { exercisesList }
}

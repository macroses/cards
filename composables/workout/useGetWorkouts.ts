import type { GetWorkoutsResponse } from '~/types/GetWorkoutsResponse'

const URL = '/api/workout/workouts'

// add, remove or update workout must trigger fetch
// if we translate new data, so fetch
export function useGetWorkouts(updatedData?: unknown) {
  const { data: workouts, status, error, refresh } = useFetch<GetWorkoutsResponse[]>(
    URL,
    {
      key: 'workouts',
      method: 'GET',
      timeout: 10000,
      dedupe: 'defer',
      watch: updatedData ? [updatedData] : [],
    },
  )

  return {
    workouts,
    status,
    error,
    refresh,
  }
}

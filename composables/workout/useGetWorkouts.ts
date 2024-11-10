import type { GetWorkoutsResponse } from '~/types/GetWorkoutsResponse'

const URL = '/api/workout/workouts'

export function useGetWorkouts(updatedData?: unknown) {
  const { data: workouts, status, error } = useFetch<GetWorkoutsResponse[]>(
    URL,
    {
      key: 'globalWorkouts',
      method: 'GET',
      timeout: 10000,
      dedupe: 'defer',
      watch: updatedData ? [updatedData] : [],
    },
  )

  async function refresh() {
    return await $fetch<GetWorkoutsResponse[]>(URL, {
      method: 'GET',
    })
  }

  return {
    workouts,
    status,
    error,
    refresh,
  }
}

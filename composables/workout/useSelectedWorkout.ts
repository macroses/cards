import dayjs from 'dayjs'
import type { GetWorkoutsResponse } from '~/types/GetWorkoutsResponse'

export function useSelectedWorkout() {
  const selectedDate = useState<Date>('selectedWorkoutDate', () => new Date())
  const workouts = useState<GetWorkoutsResponse[] | null>('globalWorkouts', () => null)

  const selectedWorkout = computed(() =>
    workouts.value?.find((workout: GetWorkoutsResponse) => {
      return dayjs(workout.workoutDate).isSame(selectedDate.value, 'day')
    }),
  )

  return {
    selectedWorkout,
    selectedDate,
    workouts,
  }
}

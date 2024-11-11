import dayjs from 'dayjs'
import type { IWorkout } from '~/types/GetWorkoutsResponse'

export function useSelectedWorkout() {
  const selectedDate = useState<Date>('selectedWorkoutDate', () => new Date())
  const workouts = useState<IWorkout[] | null>('globalWorkouts', () => null)

  const selectedWorkout = computed(() =>
    workouts.value?.find((workout: IWorkout) => {
      return dayjs(workout.workoutDate).isSame(selectedDate.value, 'day')
    }),
  )

  return {
    selectedWorkout,
    selectedDate,
    workouts,
  }
}

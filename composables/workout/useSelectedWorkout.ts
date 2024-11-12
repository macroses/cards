import dayjs from 'dayjs'
import type { CreateWorkoutResponse } from '~/ts/interfaces/createWorkout.interface'

export function useSelectedWorkout() {
  const selectedDate = useState<Date>('selectedWorkoutDate', () => new Date())
  const workouts = useState<CreateWorkoutResponse[] | null>('globalWorkouts', () => null)

  const selectedWorkout = computed(() =>
    workouts.value?.find((workout: CreateWorkoutResponse) => {
      return dayjs(workout.workoutDate).isSame(selectedDate.value, 'day')
    }),
  )

  return {
    selectedWorkout,
    selectedDate,
    workouts,
  }
}

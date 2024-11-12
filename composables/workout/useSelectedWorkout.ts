import dayjs from 'dayjs'
import { GLOBAL_WORKOUTS } from '~/constants/strings'
import type { CreateWorkoutResponse } from '~/ts/interfaces'

export function useSelectedWorkout() {
  const selectedDate = useState<Date>('selectedWorkoutDate', () => new Date())
  const workouts = useState<CreateWorkoutResponse[] | null>(GLOBAL_WORKOUTS, () => null)

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

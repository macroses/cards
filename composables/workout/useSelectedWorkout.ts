import dayjs from 'dayjs'
import { GLOBAL_WORKOUTS } from '~/constants'
import type { CreateWorkoutResponse } from '~/ts/interfaces'

const STATE_KEY = 'selectedWorkoutDate'

export function useSelectedWorkout() {
  const selectedDate = useState<Date>(STATE_KEY, () => new Date())
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

import {
  GLOBAL_ACTIVE_WORKOUT,
  GLOBAL_WORKOUT_TIMER,
  INITIAL_TIME,
} from '~/constants'
import type { UserWorkout } from '~/ts/interfaces'

export function useWorkoutTimer() {
  const timer = useState<string>(GLOBAL_WORKOUT_TIMER, () => INITIAL_TIME)
  const intervalId = ref<NodeJS.Timeout | null>(null)
  const activeWorkout = useState<{ startedAt: Date, id: string } | null>(GLOBAL_ACTIVE_WORKOUT, () => null)

  function startTimer(startDate: Date, workoutId: string) {
    activeWorkout.value = { startedAt: startDate, id: workoutId }

    intervalId.value = setInterval(() => {
      if (!activeWorkout.value) {
        cleanup()

        return
      }

      const elapsed = Date.now() - new Date(startDate).getTime()
      timer.value = formattedTime(elapsed)
    }, 1000)
  }

  function stopTimer() {
    cleanup()

    activeWorkout.value = null
    timer.value = INITIAL_TIME
  }

  function checkActiveWorkout(workouts: UserWorkout[]) {
    const startedWorkout = workouts.find(w => w.startedAt && !w.endedAt)

    if (startedWorkout?.startedAt && startedWorkout.id) {
      startTimer(new Date(startedWorkout.startedAt), startedWorkout.id)
    }
  }

  function cleanup() {
    if (intervalId.value) {
      clearInterval(intervalId.value)
      intervalId.value = null
    }
  }

  return {
    timer,
    activeWorkout,
    startTimer,
    stopTimer,
    checkActiveWorkout,
    cleanup,
  }
}

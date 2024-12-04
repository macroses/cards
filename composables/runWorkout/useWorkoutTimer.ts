import type { UserWorkout } from '~/ts/interfaces'

const GLOBAL_WORKOUT_TIMER = 'workout-timer'
const INITIAL_TIME = '00:00:00'
const GLOBAL_ACTIVE_WORKOUT = 'active-workout'

export function useWorkoutTimer() {
  const timer = useState<string>(GLOBAL_WORKOUT_TIMER, () => INITIAL_TIME)
  const intervalId = ref<NodeJS.Timeout | null>(null)
  const activeWorkout = useState<{ startedAt: Date, id: string } | null>(GLOBAL_ACTIVE_WORKOUT, () => null)

  function startTimer(startDate: Date, workoutId: string) {
    if (intervalId.value) {
      return
    }

    activeWorkout.value = { startedAt: startDate, id: workoutId }

    intervalId.value = setInterval(() => {
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

    if (startedWorkout?.startedAt) {
      startTimer(new Date(startedWorkout.startedAt), startedWorkout.id)
    }
  }

  function cleanup() {
    if (intervalId.value !== null) {
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

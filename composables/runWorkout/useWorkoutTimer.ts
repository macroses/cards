import type { UserWorkout } from '~/ts/interfaces'

const GLOBAL_WORKOUT_TIMER = 'workout-timer'
const INITIAL_TIME = '00:00:00'
const GLOBAL_ACTIVE_WORKOUT = 'active-workout'

export function useWorkoutTimer() {
  const timer = useState<string>(GLOBAL_WORKOUT_TIMER, () => INITIAL_TIME)
  const intervalId = ref<NodeJS.Timeout | null>(null)
  const activeWorkout = useState<{ startedAt: Date } | null>(GLOBAL_ACTIVE_WORKOUT, () => null)

  function startTimer(startDate: Date) {
    if (intervalId.value) {
      return
    }

    activeWorkout.value = { startedAt: startDate }

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
    const activeWorkout = workouts.find(w => w.startedAt && !w.endedAt)

    if (activeWorkout?.startedAt) {
      startTimer(new Date(activeWorkout.startedAt))
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

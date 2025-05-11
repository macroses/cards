import type { CreateWorkoutResponse, UserWorkout } from '~/ts/interfaces'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import {
  GLOBAL_ACTIVE_WORKOUT,
  GLOBAL_WORKOUT_TIMER,
  INITIAL_TIME,
} from '~/constants'

dayjs.extend(duration)

/**
 * Composable for workout timer management.
 * Handles timer start/stop, tracks active workout time, and maintains timer state.
 */

type Workout = UserWorkout | CreateWorkoutResponse
type WorkoutList = Workout[]

interface ActiveWorkout {
  startedAt: Date
  id: string
}

export function useWorkoutTimer() {
  const timer = useState<string>(GLOBAL_WORKOUT_TIMER, () => INITIAL_TIME)
  const intervalId = ref<ReturnType<typeof setInterval> | null>(null)
  const activeWorkout = useState<ActiveWorkout | null>(GLOBAL_ACTIVE_WORKOUT, () => null)

  function startTimer(startDate: Date, workoutId: string): void {
    activeWorkout.value = { startedAt: startDate, id: workoutId }
    cleanup()

    intervalId.value = setInterval(() => {
      if (!activeWorkout.value) {
        cleanup()
        return
      }

      const elapsed = dayjs().diff(dayjs(startDate))
      timer.value = dayjs.duration(elapsed).format('HH:mm:ss')
    }, 1000)
  }

  function stopTimer() {
    cleanup()
    activeWorkout.value = null
    timer.value = INITIAL_TIME
  }

  function checkActiveWorkout(workouts: WorkoutList) {
    const startedWorkout = workouts.find(({ startedAt, endedAt }) => startedAt && !endedAt)

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

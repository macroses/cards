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

type UnionWorkout = UserWorkout[] | CreateWorkoutResponse[]

export function useWorkoutTimer() {
  const timer = useState<string>(GLOBAL_WORKOUT_TIMER, () => INITIAL_TIME)
  const intervalId = ref<ReturnType<typeof setInterval> | null>(null)
  const activeWorkout = useState<{ startedAt: Date, id: string } | null>(GLOBAL_ACTIVE_WORKOUT, () => null)

  function startTimer(startDate: Date, workoutId: string) {
    activeWorkout.value = { startedAt: startDate, id: workoutId }

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

  function checkActiveWorkout(workouts: UnionWorkout) {
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

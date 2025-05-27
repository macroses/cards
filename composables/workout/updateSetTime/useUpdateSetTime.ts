import type { TrainingSession } from '~/ts'
import type { CreateWorkoutResponse } from '~/ts/interfaces'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import { useUpdateCachedWorkout } from '../runWorkout/useUpdateCachedWorkout/useUpdateCachedWorkout'
import { useWorkoutTimer } from '../workoutTimer/useWorkoutTimer'

dayjs.extend(duration)

/**
 * Composable for updating set time.
 * Finds last marked set, calculates elapsed time interval, and updates set time.
 */

export function useUpdateSetTime() {
  const { activeWorkout } = useWorkoutTimer()
  const { updateSetField } = useUpdateCachedWorkout()

  function findLastMarkedSet(workoutSets: TrainingSession[]) {
    return workoutSets
      .filter(set => set.setTimeAddedAt !== null)
      .sort((a, b) => {
        return dayjs(b.setTimeAddedAt).unix() - dayjs(a.setTimeAddedAt).unix()
      })[0] || null
  }

  async function updateSetTime(workout: CreateWorkoutResponse, setId: string): Promise<void> {
    if (!activeWorkout.value?.startedAt) {
      return
    }

    const lastMarkedSet = findLastMarkedSet(workout.sets)

    let elapsed: number

    if (lastMarkedSet?.setTimeAddedAt) {
      elapsed = dayjs().diff(dayjs(lastMarkedSet.setTimeAddedAt), 'second')
    }
    else {
      elapsed = dayjs().diff(dayjs(activeWorkout.value.startedAt), 'second')
    }

    await updateSetField(workout, setId, 'setTimeAddedAt', dayjs().toISOString())

    return await updateSetField(workout, setId, 'setTime', elapsed)
  }

  return {
    updateSetTime,
  }
}

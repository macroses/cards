import type { CreateWorkoutResponse } from '~/ts/interfaces'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import { useUpdateCachedWorkout } from '../runWorkout/useUpdateCachedWorkout'
import { useWorkoutTimer } from '../workoutTimer/useWorkoutTimer'

dayjs.extend(duration)

export function useUpdateSetTime() {
  const { activeWorkout } = useWorkoutTimer()
  const { updateSetField } = useUpdateCachedWorkout()

  function findLastMarkedSet(workout: CreateWorkoutResponse) {
    // Находим последний отмеченный сет по времени setTimeAddedAt
    return workout.sets
      .filter(set => set.setTimeAddedAt !== null)
      .sort((a, b) => {
        return dayjs(b.setTimeAddedAt).unix() - dayjs(a.setTimeAddedAt).unix()
      })[0] || null
  }

  async function updateSetTime(workout: CreateWorkoutResponse, setId: string): Promise<boolean> {
    if (!activeWorkout.value?.startedAt) {
      return false
    }

    const lastMarkedSet = findLastMarkedSet(workout)

    let elapsed: number
    if (lastMarkedSet?.setTimeAddedAt) {
      // Считаем время от момента сохранения последнего отмеченного сета
      elapsed = dayjs().diff(dayjs(lastMarkedSet.setTimeAddedAt), 'second')
    }
    else {
      // Для первого сета тренировки считаем время от начала тренировки
      elapsed = dayjs().diff(dayjs(activeWorkout.value.startedAt), 'second')
    }

    await updateSetField(workout, setId, 'setTimeAddedAt', dayjs().toISOString())
    return await updateSetField(workout, setId, 'setTime', elapsed)
  }

  return {
    updateSetTime,
  }
}

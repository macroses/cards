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
        const dateA = a.setTimeAddedAt ? new Date(a.setTimeAddedAt) : new Date(0)
        const dateB = b.setTimeAddedAt ? new Date(b.setTimeAddedAt) : new Date(0)
        return dateB.getTime() - dateA.getTime()
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

    // Обновляем не только setTime, но и setTimeAddedAt
    await updateSetField(workout, setId, 'setTimeAddedAt', new Date().toISOString())
    return await updateSetField(workout, setId, 'setTime', elapsed)
  }

  return {
    updateSetTime,
  }
}

import type { CreateWorkoutResponse } from '~/ts/interfaces'
import dayjs from 'dayjs'

interface WorkoutPrediction {
  remainingMinutes: number
}

/**
 * Композабл для предсказания времени завершения тренировки
 * Рассчитывает оставшееся время на основе текущего темпа и оставшихся подходов
 */
export function useWorkoutPrediction() {
  const estimatedFinishTime = ref<string | null>(null)
  const averageSetTime = ref<number | null>(null)

  // Минимальное время подхода в секундах, при котором имеет смысл показывать предсказание
  const MIN_SET_TIME_SECONDS = 10
  // Минимальное оставшееся время в минутах, при котором имеет смысл показывать предсказание
  const MIN_REMAINING_MINUTES = 1

  /**
   * Рассчитывает предполагаемое время завершения тренировки
   */
  function calculateEstimatedFinishTime(workout: CreateWorkoutResponse | null): WorkoutPrediction | null {
    if (!workout || !workout.startedAt) {
      return null
    }

    const completedSets = workout.sets.filter(set => set.setTimeAddedAt)
    const remainingSets = workout.sets.length - completedSets.length

    if (completedSets.length === 0 || remainingSets === 0) {
      estimatedFinishTime.value = null
      return null
    }

    // Проверяем, что время подходов не слишком маленькое
    const setTimesInSeconds = completedSets
      .filter(set => set.setTime)
      .map(set => set.setTime as number)

    // Если все времена подходов меньше минимального, не показываем предсказание
    if (setTimesInSeconds.length > 0 && setTimesInSeconds.every(time => time < MIN_SET_TIME_SECONDS)) {
      return null
    }

    // Получаем все интервалы между подходами
    const intervals: number[] = []
    let previousTime = dayjs(workout.startedAt)

    completedSets
      .sort((a, b) => dayjs(a.setTimeAddedAt!).unix() - dayjs(b.setTimeAddedAt!).unix())
      .forEach((set) => {
        const currentTime = dayjs(set.setTimeAddedAt)
        intervals.push(currentTime.diff(previousTime, 'minute'))
        previousTime = currentTime
      })

    // Вычисляем медиану
    const sortedIntervals = [...intervals].sort((a, b) => a - b)

    const medianTime = intervals.length % 2 === 0
      ? (sortedIntervals[intervals.length / 2 - 1] + sortedIntervals[intervals.length / 2]) / 2
      : sortedIntervals[Math.floor(intervals.length / 2)]

    averageSetTime.value = medianTime

    const remainingMinutes = medianTime * remainingSets

    // Если оставшееся время слишком маленькое, не показываем предсказание
    if (remainingMinutes < MIN_REMAINING_MINUTES) {
      return null
    }

    return {
      remainingMinutes: Math.round(remainingMinutes),
    }
  }

  function getRemainingTimeText(workout: CreateWorkoutResponse): string | null {
    const result = calculateEstimatedFinishTime(workout)

    if (!result) {
      return null
    }

    return `Примерное завершение через ${result.remainingMinutes} мин`
  }

  return {
    averageSetTime,
    calculateEstimatedFinishTime,
    getRemainingTimeText,
  }
}

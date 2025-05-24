import type { CreateWorkoutResponse, Statistics } from '~/ts/interfaces'
import { KEYS } from '~/constants'

const SECOND = 1000
const MINUTE = 60

/**
 * Composable для управления глобальной статистикой тренировок.
 */
export function useGlobalStatistics() {
  const globalStats = useState<Statistics | null>(KEYS.GLOBAL_STATISTICS, () => null)
  const workouts = useState<CreateWorkoutResponse[] | null>(KEYS.GLOBAL_WORKOUTS)

  function calculateMaxTonnage(completedWorkouts: CreateWorkoutResponse[]): number {
    if (completedWorkouts.length === 0) {
      return 0
    }

    let maxTonnage = -Infinity

    for (const workout of completedWorkouts) {
      let workoutTonnage = 0

      for (const set of workout.sets) {
        workoutTonnage += (set.weight * set.repeats) / SECOND
      }

      maxTonnage = Math.max(maxTonnage, workoutTonnage)
    }

    return maxTonnage
  }

  function calculateTotalTonnage(completedWorkouts: CreateWorkoutResponse[]): number {
    if (completedWorkouts.length === 0) {
      return 0
    }

    let totalTonnage = 0

    for (const workout of completedWorkouts) {
      for (const set of workout.sets) {
        totalTonnage += (set.weight * set.repeats) / SECOND
      }
    }

    return totalTonnage
  }

  function calculateAvgWorkoutDuration(completedWorkouts: CreateWorkoutResponse[]): number {
    let totalDuration = 0
    let workoutsWithTimeCount = 0

    for (const workout of completedWorkouts) {
      if (workout.startedAt && workout.endedAt) {
        totalDuration += (new Date(workout.endedAt).getTime() - new Date(workout.startedAt).getTime()) / (SECOND * MINUTE)
        workoutsWithTimeCount++
      }
    }

    return workoutsWithTimeCount ? totalDuration / workoutsWithTimeCount : 0
  }

  function calculateAvgSetTime(completedWorkouts: CreateWorkoutResponse[]): number {
    let totalSetTime = 0
    let totalSets = 0

    for (const workout of completedWorkouts) {
      for (const set of workout.sets) {
        totalSetTime += (set.setTime || 0)
      }
      totalSets += workout.sets.length
    }

    return totalSets ? totalSetTime / totalSets : 0
  }

  /**
   * Обновление статистики на основе данных тренировок
   */
  const refresh = () => {
    if (!workouts.value || workouts.value.length === 0) {
      globalStats.value = null
      return
    }

    // Получаем только завершенные тренировки для расчета статистики
    const completedWorkouts = workouts.value.filter(({ completed }) => completed)

    if (completedWorkouts.length === 0) {
      globalStats.value = null
      return
    }

    const maxTonnage = calculateMaxTonnage(completedWorkouts)
    const totalTonnage = calculateTotalTonnage(completedWorkouts)
    const avgWorkoutDuration = calculateAvgWorkoutDuration(completedWorkouts)
    const avgSetTime = calculateAvgSetTime(completedWorkouts)

    globalStats.value = {
      maxTonnage: Number(maxTonnage.toFixed(2)),
      totalTonnage: Number(totalTonnage.toFixed(2)),
      avgWorkoutDuration: Math.round(avgWorkoutDuration),
      avgSetTime: Math.round(avgSetTime),
      completedWorkouts: completedWorkouts.length,
      totalWorkouts: workouts.value.length,
    }
  }

  watch(() => workouts.value, () => refresh(), { deep: true })

  return {
    statistics: computed(() => globalStats.value),
    refresh,
  }
}

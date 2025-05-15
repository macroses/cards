import type {
  CreateWorkoutResponse,
  MetricCharts,
  Metrics,
  WorkoutChartData,
  WorkoutSet,
} from '~/ts/interfaces/'

/**
 * Composable for analyzing differences between planned and actual workout data.
 * Provides methods for generating chart data to visualize the differences
 * (weight, repeats).
 */
export function useWorkoutDifference() {
  const { t } = useI18n()

  function createChartConfig(
    xAxisData: string[],
    yAxisName: string,
    plannedData: number[],
    actualData: number[],
  ): WorkoutChartData {
    return ({
      grid: {
        top: 50,
        right: 0,
        bottom: 10,
        left: 10,
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        data: xAxisData,
      },
      yAxis: {
        type: 'value',
        name: yAxisName,
      },
      series: createChartSeries(plannedData, actualData),
      tooltip: createChartTooltip(),
      legend: {
        show: true,
      },
    } as const)
  }

  function createChartSeries(
    plannedData: number[],
    actualData: number[],
  ) {
    return [
      {
        name: t('workout.planned'),
        data: plannedData,
        type: 'bar',
        barGap: 0,
      },
      {
        name: t('workout.actual'),
        data: actualData,
        type: 'bar',
      },
    ]
  }

  function createChartTooltip() {
    return {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
      formatter: formatTooltip,
    }
  }

  function formatTooltip(params: Array<{ name: string, seriesName: string, value: number }>) {
    const plannedValue = params[0].value
    const actualValue = params[1].value
    const difference = actualValue - plannedValue
    const percentChange = calculatePercentChange(plannedValue, actualValue)

    return `${params[0].name}<br/>
            ${params[0].seriesName}: ${plannedValue}<br/>
            ${params[1].seriesName}: ${actualValue}<br/>
            ${t('workout.difference')}: ${formatDifference(difference, percentChange)}`
  }

  function calculatePercentChange(planned: number, actual: number): number {
    if (planned === 0) {
      return actual > 0 ? 100 : 0
    }
    return Number(((actual - planned) / planned * 100).toFixed(1))
  }

  function formatDifference(difference: number, percentChange: number): string {
    const diffPrefix = difference > 0 ? '+' : ''
    const percentPrefix = percentChange > 0 ? '+' : ''
    return `${diffPrefix}${difference} (${percentPrefix}${percentChange}%)`
  }

  function groupSetsByExercise(workoutSets: WorkoutSet[]): Record<string, WorkoutSet[]> {
    return workoutSets.reduce((result, set) => {
      if (!result[set.exerciseId]) {
        result[set.exerciseId] = []
      }

      result[set.exerciseId].push(set)

      return result
    }, {} as Record<string, WorkoutSet[]>)
  }

  function createExerciseNameMap(workout: CreateWorkoutResponse): Record<string, string> {
    return workout.exercises.reduce((result, exercise) => {
      result[exercise.exerciseId] = exercise.exerciseName

      return result
    }, {} as Record<string, string>)
  }

  function calculateSetMetric(
    sets: WorkoutSet[],
    valueSelector: (set: WorkoutSet) => number,
  ): number {
    const validSets = sets.filter(set => set.weight > 0 && set.repeats > 0)

    if (validSets.length === 0) {
      return 0
    }

    return validSets.reduce((sum, set) => sum + valueSelector(set), 0)
  }

  function sumWeightedRepeats(sets: WorkoutSet[]): number {
    return calculateSetMetric(sets, set => (set.weight * set.repeats) / 1000)
  }

  function sumRepeats(sets: WorkoutSet[]): number {
    return calculateSetMetric(sets, set => set.repeats)
  }

  function createMetrics(): Pick<Metrics, 'weight' | 'repeats'> {
    return {
      weight: {
        name: `${t('workout.weight')} (T)`,
        current: set => set.weight,
        previous: set => set.weight,
      },
      repeats: {
        name: t('workout.repeats'),
        current: set => set.repeats,
        previous: set => set.repeats,
      },
    }
  }

  function getWorkoutDifferenceData(
    workout: CreateWorkoutResponse,
    originalWorkout: CreateWorkoutResponse,
  ): Pick<MetricCharts, 'weight' | 'repeats'> {
    const exerciseSets = groupSetsByExercise(workout.sets)
    const originalExerciseSets = groupSetsByExercise(originalWorkout.sets)

    const exerciseNames = createExerciseNameMap(workout)
    const exerciseIds = Object.keys(exerciseNames)

    const xAxisData = exerciseIds.map(id => exerciseNames[id])

    const weightPlanned: number[] = []
    const weightActual: number[] = []
    const repeatsPlanned: number[] = []
    const repeatsActual: number[] = []

    exerciseIds.forEach((exerciseId) => {
      const actualSets = exerciseSets[exerciseId] || []
      const plannedSets = originalExerciseSets[exerciseId] || []

      const hasValidActualSets = actualSets.some(set => set.weight > 0 && set.repeats > 0)
      const hasValidPlannedSets = plannedSets.some(set => set.weight > 0 && set.repeats > 0)

      if (hasValidActualSets || hasValidPlannedSets) {
        weightPlanned.push(sumWeightedRepeats(plannedSets))
        weightActual.push(sumWeightedRepeats(actualSets))
        repeatsPlanned.push(sumRepeats(plannedSets))
        repeatsActual.push(sumRepeats(actualSets))
      }
    })

    const metrics = createMetrics()

    return {
      weight: createChartConfig(
        xAxisData,
        metrics.weight.name,
        weightPlanned,
        weightActual,
      ),
      repeats: createChartConfig(
        xAxisData,
        metrics.repeats.name,
        repeatsPlanned,
        repeatsActual,
      ),
    }
  }

  return {
    getWorkoutDifferenceData,
  }
}

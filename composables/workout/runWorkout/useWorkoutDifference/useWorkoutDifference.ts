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
        right: 20,
        bottom: 10,
        left: 16,
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
      series: [
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
      ],
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
        formatter(params: Array<{ name: string, seriesName: string, value: number }>) {
          const plannedValue = params[0].value
          const actualValue = params[1].value
          const difference = actualValue - plannedValue
          const percentChange = plannedValue === 0
            ? (actualValue > 0 ? 100 : 0)
            : Number(((actualValue - plannedValue) / plannedValue * 100).toFixed(1))

          return `${params[0].name}<br/>
                 ${params[0].seriesName}: ${plannedValue}<br/>
                 ${params[1].seriesName}: ${actualValue}<br/>
                 ${t('workout.difference')}: ${difference > 0 ? '+' : ''}${difference} (${percentChange > 0 ? '+' : ''}${percentChange}%)`
        },
      },
      legend: {
        show: true,
      },
    } as const)
  }

  function getWorkoutDifferenceData(
    workout: CreateWorkoutResponse,
    originalWorkout: CreateWorkoutResponse,
  ): Pick<MetricCharts, 'weight' | 'repeats'> {
    const exerciseSets: Record<string, WorkoutSet[]> = {}
    const originalExerciseSets: Record<string, WorkoutSet[]> = {}

    workout.sets.forEach((set) => {
      if (!exerciseSets[set.exerciseId]) {
        exerciseSets[set.exerciseId] = []
      }
      exerciseSets[set.exerciseId].push(set)
    })

    originalWorkout.sets.forEach((set) => {
      if (!originalExerciseSets[set.exerciseId]) {
        originalExerciseSets[set.exerciseId] = []
      }
      originalExerciseSets[set.exerciseId].push(set)
    })

    // Find exercise names
    const exerciseNames: Record<string, string> = {}
    workout.exercises.forEach((exercise) => {
      exerciseNames[exercise.exerciseId] = exercise.exerciseName
    })

    // Create x-axis data with exercise names
    const xAxisData = Object.keys(exerciseNames).map(id => exerciseNames[id])

    // Calculate average values for each exercise
    const weightPlanned: number[] = []
    const weightActual: number[] = []
    const repeatsPlanned: number[] = []
    const repeatsActual: number[] = []

    Object.keys(exerciseNames).forEach((exerciseId) => {
      const actualSets = exerciseSets[exerciseId] || []
      const plannedSets = originalExerciseSets[exerciseId] || []

      // Calculate average weight
      const avgWeightPlanned = plannedSets.length > 0
        ? plannedSets.reduce((sum, set) => sum + (set.weight * set.repeats), 0) / plannedSets.length
        : 0
      const avgWeightActual = actualSets.length > 0
        ? actualSets.reduce((sum, set) => sum + (set.weight * set.repeats), 0) / actualSets.length
        : 0

      weightPlanned.push(avgWeightPlanned)
      weightActual.push(avgWeightActual)

      // Calculate average repeats
      const avgRepeatsPlanned = plannedSets.length > 0
        ? plannedSets.reduce((sum, set) => sum + set.repeats, 0) / plannedSets.length
        : 0
      const avgRepeatsActual = actualSets.length > 0
        ? actualSets.reduce((sum, set) => sum + set.repeats, 0) / actualSets.length
        : 0

      repeatsPlanned.push(avgRepeatsPlanned)
      repeatsActual.push(avgRepeatsActual)
    })

    const metrics: Pick<Metrics, 'weight' | 'repeats'> = {
      weight: {
        name: t('workout.weight'),
        current: set => set.weight,
        previous: set => set.weight,
      },
      repeats: {
        name: t('workout.repeats'),
        current: set => set.repeats,
        previous: set => set.repeats,
      },
    }

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

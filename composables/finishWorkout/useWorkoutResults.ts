import type {
  CreateWorkoutResponse,
  MetricCharts,
  MetricFn,
  Metrics,
  ProgressData,
  ProgressMetrics,
  WorkoutSet,
} from '~/ts/interfaces/'

/**
 * Composable for analyzing workout results and comparing them with previous workouts.
 * Provides methods for generating chart data and calculating progress metrics
 * (weight, repeats, time, volume).
 */
export function useWorkoutResults() {
  const { t } = useI18n()

  const findPreviousWorkout = (
    currentWorkout: CreateWorkoutResponse,
    exerciseId: string,
    workouts: CreateWorkoutResponse[],
  ) => {
    return workouts
      .filter(w =>
        w.id !== currentWorkout.id
        && w.completed
        && new Date(w.workoutDate) < new Date(currentWorkout.workoutDate)
        && w.exercises.some(e => e.exerciseId === exerciseId),
      )
      .sort((a, b) => new Date(b.workoutDate).getTime() - new Date(a.workoutDate).getTime())[0]
  }

  const createChartConfig = (
    xAxisData: string[],
    yAxisName: string,
    currentData: number[],
    previousData: number[],
  ) => ({
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
        name: t('workout.current_workout'),
        data: currentData,
        type: 'line',
        smooth: true,
        lineStyle: {
          width: 3,
        },
      },
      {
        name: t('workout.previous_workout'),
        data: previousData,
        type: 'line',
        smooth: true,
        lineStyle: {
          type: 'dashed',
          width: 2,
        },
      },
    ],
    tooltip: {
      trigger: 'axis',
    },
    legend: {
      show: true,
    },
  } as const)

  const getExerciseData = (
    workout: CreateWorkoutResponse,
    exerciseId: string,
    workouts: CreateWorkoutResponse[],
  ): MetricCharts => {
    const exerciseSets = workout.sets.filter(set => set.exerciseId === exerciseId)
    const previousWorkout = findPreviousWorkout(workout, exerciseId, workouts)
    const previousSets = previousWorkout?.sets.filter(set => set.exerciseId === exerciseId) || []

    const maxSets = Math.max(exerciseSets.length, previousSets.length)
    const xAxisData = Array.from({ length: maxSets }, (_, i) => `${t('workout.set')} ${i + 1}`)

    const metrics: Metrics = {
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
      time: {
        name: t('workout.time'),
        current: set => set.setTime || 0,
        previous: set => set.setTime || 0,
      },
      volume: {
        name: t('workout.volume'),
        current: set => set.weight * set.repeats,
        previous: set => set.weight * set.repeats,
      },
    }

    return Object.entries(metrics).reduce((acc, [key, metric]) => ({
      ...acc,
      [key]: createChartConfig(
        xAxisData,
        metric.name,
        exerciseSets.map(metric.current),
        previousSets.map(metric.previous),
      ),
    }), {} as MetricCharts)
  }

  const calculateStats = (sets: WorkoutSet[], getValue: MetricFn) => {
    const values = sets.map(getValue)
    return {
      avg: values.reduce((sum, val) => sum + val, 0) / values.length,
      max: Math.max(...values),
    }
  }

  const getProgressData = (
    currentWorkout: CreateWorkoutResponse,
    exerciseId: string,
    workouts: CreateWorkoutResponse[],
  ): ProgressData | null => {
    const previousWorkout = findPreviousWorkout(currentWorkout, exerciseId, workouts)

    if (!previousWorkout) {
      return null
    }

    const currentSets = currentWorkout.sets.filter(set => set.exerciseId === exerciseId)
    const previousSets = previousWorkout.sets.filter(set => set.exerciseId === exerciseId)

    const getPercentChange = (current: number, previous: number) => {
      if (previous === 0) {
        return current > 0 ? 100 : 0
      }

      return ((current - previous) / previous) * 100
    }

    const metrics: ProgressMetrics = {
      weight: set => set.weight,
      repeats: set => set.repeats,
      time: set => set.setTime || 0,
      volume: set => set.weight * set.repeats,
    }

    const result = Object.entries(metrics).reduce((acc, [key, getValue]) => {
      const current = calculateStats(currentSets, getValue)
      const previous = calculateStats(previousSets, getValue)

      return {
        ...acc,
        [key]: {
          current: current.avg,
          previous: previous.avg,
          change: getPercentChange(current.avg, previous.avg),
          max: {
            current: current.max,
            previous: previous.max,
            change: getPercentChange(current.max, previous.max),
          },
        },
      }
    }, {} as Omit<ProgressData, 'previousWorkoutDate'>)

    return {
      previousWorkoutDate: previousWorkout.workoutDate,
      ...result,
    }
  }

  return {
    getExerciseData,
    getProgressData,
  }
}

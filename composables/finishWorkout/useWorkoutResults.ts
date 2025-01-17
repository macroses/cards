import type { CreateWorkoutResponse } from '~/ts/interfaces/createWorkout.interface'

export function useWorkoutResults() {
  const { t } = useI18n()

  const findPreviousWorkout = (
    currentWorkout: CreateWorkoutResponse,
    exerciseId: number,
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
  })

  const getExerciseData = (
    workout: CreateWorkoutResponse,
    exerciseId: number,
    workouts: CreateWorkoutResponse[],
  ) => {
    const exerciseSets = workout.sets.filter(set => set.exerciseId === exerciseId)
    const previousWorkout = findPreviousWorkout(workout, exerciseId, workouts)
    const previousSets = previousWorkout?.sets.filter(set => set.exerciseId === exerciseId) || []

    const maxSets = Math.max(exerciseSets.length, previousSets.length)
    const xAxisData = Array.from({ length: maxSets }, (_, i) => `${t('workout.set')} ${i + 1}`)

    const metrics = {
      weight: {
        name: t('workout.weight'),
        current: (set: any) => set.weight,
        previous: (set: any) => set.weight,
      },
      repeats: {
        name: t('workout.repeats'),
        current: (set: any) => set.repeats,
        previous: (set: any) => set.repeats,
      },
      time: {
        name: t('workout.time'),
        current: (set: any) => set.setTime || 0,
        previous: (set: any) => set.setTime || 0,
      },
      volume: {
        name: t('workout.volume'),
        current: (set: any) => set.weight * set.repeats,
        previous: (set: any) => set.weight * set.repeats,
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
    }), {})
  }

  const calculateStats = (sets: any[], getValue: (set: any) => number) => {
    const values = sets.map(getValue)
    return {
      avg: values.reduce((sum, val) => sum + val, 0) / values.length,
      max: Math.max(...values),
    }
  }

  const getProgressData = (
    currentWorkout: CreateWorkoutResponse,
    exerciseId: number,
    workouts: CreateWorkoutResponse[],
  ) => {
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

    const metrics = {
      weight: (set: any) => set.weight,
      repeats: (set: any) => set.repeats,
      time: (set: any) => set.setTime || 0,
      volume: (set: any) => set.weight * set.repeats,
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
    }, {})

    return {
      ...result,
      previousWorkoutDate: previousWorkout.workoutDate,
    }
  }

  return {
    getExerciseData,
    getProgressData,
  }
}

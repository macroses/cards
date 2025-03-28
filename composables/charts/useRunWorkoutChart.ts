import type { CreateWorkoutResponse } from '~/ts/interfaces'

export function useRunWorkoutChart() {
  const { t } = useI18n()

  function getData<T extends CreateWorkoutResponse>(
    originalWorkout: T | null,
    runWorkout: T | null | undefined,
    activeExercises?: Set<string>,
  ): ECOption {
    if (!originalWorkout || !runWorkout) {
      return {
        animation: false,
        tooltip: {
          className: 'echarts-tooltip',
        },
        toolbox: {
          show: false,
        },
        xAxis: { type: 'category' },
        yAxis: {},
        series: [],
      }
    }

    const exerciseChartData = runWorkout.exercises.map((exercise) => {
      const originalSets = originalWorkout?.sets.filter(
        set => set.exerciseId === exercise.exerciseId,
      ) || []

      const currentSets = runWorkout?.sets.filter(
        set => set.exerciseId === exercise.exerciseId,
      ) || []

      return {
        exerciseId: exercise.exerciseId,
        exerciseName: exercise.exerciseName,
        original: originalSets.reduce((total, set) => total + ((set.weight || 0) * (set.repeats || 0)), 0),
        current: currentSets.reduce((total, set) => total + ((set.weight || 0) * (set.repeats || 0)), 0),
      }
    })

    return {
      animation: true,
      tooltip: {
        className: 'echarts-tooltip',
        trigger: 'axis',
      },
      legend: {
        data: [t('charts.original'), t('charts.current')],
        bottom: 0,
      },
      toolbox: {
        show: false,
      },
      xAxis: {
        type: 'category',
        data: exerciseChartData.map(d => d.exerciseName),
      },
      yAxis: {
        type: 'value',
        name: t('charts.total_tonnage'),
        nameTextStyle: {
          padding: [0, 0, 0, 400],
          fontWeight: 600,
          color: 'var(--color-text)',
        },
      },
      series: [
        {
          name: t('charts.original'),
          type: 'bar',
          data: exerciseChartData.map(d => ({
            value: d.original,
            itemStyle: {
              borderRadius: [8, 8, 0, 0],
              opacity: activeExercises?.has(d.exerciseId) ? 1 : 0.3,
              color: activeExercises?.has(d.exerciseId) ? '#409EFF' : undefined,
            },
          })),
        },
        {
          name: t('charts.current'),
          type: 'bar',
          data: exerciseChartData.map(d => ({
            value: d.current,
            itemStyle: {
              borderRadius: [8, 8, 0, 0],
              opacity: activeExercises?.has(d.exerciseId) ? 1 : 0.3,
              color: activeExercises?.has(d.exerciseId) ? '#67C23A' : undefined,
            },
          })),
        },
      ],
    }
  }

  return {
    getData,
  }
}

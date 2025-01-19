import type { CreateWorkoutResponse, ExerciseServerTemplate, WorkoutSet } from '~/ts/interfaces'

interface ChartData {
  date: Date
  volume: number
  intensity: number
}

interface ExerciseData {
  date: Date
  maxWeight: number
  avgWeight: number
  setsCount: number
}

interface DurationData {
  date: Date
  duration: number
  avgSetTime: number
}

export function useGlobalCharts(workouts: Ref<CreateWorkoutResponse[]>) {
  const { t } = useI18n()
  const dayjs = useDayjs()
  const { exercisesList } = useFetchExercisesList()

  const volumeChartOption = ref<any>(null)
  const exerciseChartOption = ref<any>(null)
  const durationChartOption = ref<any>(null)
  const selectedExercise = ref<number | null>(null)
  const popularExercises = ref<number[]>([])

  function calculateVolumeAndIntensity() {
    if (!workouts.value?.length)
      return

    const data: ChartData[] = workouts.value.map((workout: CreateWorkoutResponse) => {
      const totalVolume = workout.sets.reduce((sum: number, set: WorkoutSet) => {
        if (!set.weight || !set.repeats)
          return sum
        return sum + (set.weight * set.repeats)
      }, 0)

      const totalDuration = workout.sets.reduce((sum: number, set: WorkoutSet) => {
        return sum + (set.setTime || 0)
      }, 0)

      const intensity = totalDuration > 0 ? totalVolume / totalDuration : 0

      return {
        date: workout.workoutDate,
        volume: totalVolume / 1000,
        intensity,
      }
    })

    volumeChartOption.value = {
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'cross' },
      },
      legend: {
        data: [t('dashboard.volume'), t('dashboard.intensity')],
      },
      xAxis: {
        type: 'category',
        data: data.map((item: ChartData) => dayjs(item.date).format('DD.MM.YYYY')),
      },
      yAxis: [
        {
          type: 'value',
          name: t('dashboard.volume'),
          position: 'left',
        },
        {
          type: 'value',
          name: t('dashboard.intensity'),
          position: 'right',
        },
      ],
      series: [
        {
          name: t('dashboard.volume'),
          type: 'bar',
          data: data.map((item: ChartData) => Number(item.volume.toFixed(2))),
          barWidth: '60%',
          itemStyle: { borderRadius: [8, 8, 0, 0] },
        },
        {
          name: t('dashboard.intensity'),
          type: 'line',
          yAxisIndex: 1,
          data: data.map((item: ChartData) => Number(item.intensity.toFixed(2))),
          smooth: true,
          lineStyle: { width: 3 },
          symbolSize: 8,
        },
      ],
    }
  }

  function updateExerciseChart() {
    if (!selectedExercise.value || !workouts.value?.length)
      return

    const exerciseData = workouts.value.map((workout: CreateWorkoutResponse) => {
      const sets = workout.sets.filter((set: WorkoutSet) => set.exerciseId === selectedExercise.value)
      if (!sets.length)
        return null

      const maxWeight = Math.max(...sets.map((s: WorkoutSet) => s.weight))
      const avgWeight = sets.reduce((sum: number, s: WorkoutSet) => sum + s.weight, 0) / sets.length
      const setsCount = sets.length

      return {
        date: workout.workoutDate,
        maxWeight,
        avgWeight,
        setsCount,
      }
    }).filter((item): item is ExerciseData => item !== null)

    exerciseChartOption.value = {
      tooltip: { trigger: 'axis' },
      legend: {
        data: [t('dashboard.maxWeight'), t('dashboard.avgWeight'), t('dashboard.setsCount')],
      },
      xAxis: {
        type: 'category',
        data: exerciseData.map((item: ExerciseData) => dayjs(item.date).format('DD.MM.YYYY')),
      },
      yAxis: [
        {
          type: 'value',
          name: t('dashboard.weight'),
        },
        {
          type: 'value',
          name: t('dashboard.sets'),
        },
      ],
      series: [
        {
          name: t('dashboard.maxWeight'),
          type: 'line',
          data: exerciseData.map((item: ExerciseData) => item.maxWeight),
          smooth: true,
          lineStyle: { width: 3 },
          symbolSize: 8,
        },
        {
          name: t('dashboard.avgWeight'),
          type: 'line',
          data: exerciseData.map((item: ExerciseData) => Number(item.avgWeight.toFixed(1))),
          smooth: true,
          lineStyle: { width: 3 },
          symbolSize: 8,
        },
        {
          name: t('dashboard.setsCount'),
          type: 'bar',
          yAxisIndex: 1,
          data: exerciseData.map((item: ExerciseData) => item.setsCount),
          barWidth: '60%',
          itemStyle: { borderRadius: [8, 8, 0, 0] },
        },
      ],
    }
  }

  function calculateDurationChart() {
    if (!workouts.value?.length)
      return

    const data: DurationData[] = workouts.value.map((workout: CreateWorkoutResponse) => {
      const duration = workout.sets.reduce((sum: number, set: WorkoutSet) => {
        return sum + (set.setTime || 0)
      }, 0)

      const avgSetTime = duration / workout.sets.length

      return {
        date: workout.workoutDate,
        duration,
        avgSetTime,
      }
    })

    durationChartOption.value = {
      tooltip: { trigger: 'axis' },
      legend: {
        data: [t('dashboard.duration'), t('dashboard.avgSetTime')],
      },
      xAxis: {
        type: 'category',
        data: data.map((item: DurationData) => dayjs(item.date).format('DD.MM.YYYY')),
      },
      yAxis: {
        type: 'value',
        name: t('dashboard.time'),
      },
      series: [
        {
          name: t('dashboard.duration'),
          type: 'bar',
          data: data.map((item: DurationData) => Number((item.duration / 60).toFixed(1))),
          barWidth: '60%',
          itemStyle: { borderRadius: [8, 8, 0, 0] },
        },
        {
          name: t('dashboard.avgSetTime'),
          type: 'line',
          data: data.map((item: DurationData) => Number(item.avgSetTime.toFixed(1))),
          smooth: true,
          lineStyle: { width: 3 },
          symbolSize: 8,
        },
      ],
    }
  }

  function calculatePopularExercises() {
    if (!workouts.value?.length)
      return

    const exerciseCounts: Record<number, number> = {}

    workouts.value.forEach((workout: CreateWorkoutResponse) => {
      workout.exercises.forEach((exercise) => {
        if (exercise.exerciseId)
          exerciseCounts[exercise.exerciseId] = (exerciseCounts[exercise.exerciseId] || 0) + 1
      })
    })

    popularExercises.value = Object.entries(exerciseCounts)
      .sort(([, a], [, b]) => (b || 0) - (a || 0))
      .slice(0, 10)
      .map(([id]) => Number.parseInt(id))

    if (!selectedExercise.value && popularExercises.value.length > 0)
      selectedExercise.value = popularExercises.value[0]
  }

  function getExerciseName(exerciseId: number): string {
    for (const group of exercisesList.value || []) {
      const exercise = group.exercises.find((e: ExerciseServerTemplate) => e.id === exerciseId)
      if (exercise)
        return exercise.name
    }
    return `Exercise ${exerciseId}`
  }

  const charts = computed(() => [
    {
      title: 'dashboard.volumeAndIntensity',
      option: volumeChartOption.value,
      type: 'default',
    },
    {
      title: 'dashboard.exerciseProgress',
      option: exerciseChartOption.value,
      type: 'exercise',
    },
    {
      title: 'dashboard.durationAndSetTime',
      option: durationChartOption.value,
      type: 'default',
    },
  ])

  watch(() => workouts.value, () => {
    calculateVolumeAndIntensity()
    calculatePopularExercises()
    calculateDurationChart()
  }, { immediate: true })

  watch(() => selectedExercise.value, () => {
    updateExerciseChart()
  }, { immediate: true })

  return {
    charts,
    selectedExercise,
    popularExercises,
    getExerciseName,
  }
}

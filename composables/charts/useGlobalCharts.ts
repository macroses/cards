import { KEYS, API } from '~/constants'
import type { ECBasicOption } from 'echarts/types/dist/shared'
import type {
  ChartData,
  ChartsApiResponse,
  DurationData,
  ExerciseData,
  ExerciseServerTemplate,
  GlobalChartsReturn,
} from '~/ts/interfaces'

export function useGlobalCharts(): GlobalChartsReturn {
  const { t } = useI18n()
  const dayjs = useDayjs()
  const { exercisesList } = useFetchExercisesList()
  const { exercises: userExercisesList } = useExerciseHandle()

  const chartsState = useState<ChartsApiResponse | null>(KEYS.CHARTS_DATA, () => null)
  const isInitialFetch = ref(!chartsState.value)

  const volumeChartOption = ref<ECBasicOption | null>(null)
  const exerciseChartOption = ref<ECBasicOption | null>(null)
  const durationChartOption = ref<ECBasicOption | null>(null)
  const selectedExercise = ref<string | null>(null)
  const popularExercises = ref<string[]>([])
  const exerciseData = ref<Record<string, ExerciseData[]>>({})

  function processChartsData(data: ChartsApiResponse) {
    const volumeDataWithDates = data.volumeData.map(item => ({
      volume: Number(item.volume),
      intensity: Number(item.intensity),
      date: new Date(item.date),
    })) satisfies ChartData[]

    const durationDataWithDates = data.durationData.map(item => ({
      duration: Number(item.duration),
      avgSetTime: Number(item.avgSetTime),
      date: new Date(item.date),
    })) satisfies DurationData[]

    updateVolumeChart(volumeDataWithDates)
    updateDurationChart(durationDataWithDates)
    popularExercises.value = data.popularExercises.map(id => id.toString())

    exerciseData.value = Object.fromEntries(
      Object.entries(data.exerciseData).map(([id, data]) => [
        id,
        data.map(item => ({
          ...item,
          date: new Date(item.date),
        })),
      ]),
    )

    const shouldUpdateExercise = selectedExercise.value === null && data.popularExercises.length > 0
    if (shouldUpdateExercise) {
      selectedExercise.value = data.popularExercises[0].toString()
    }

    if (selectedExercise.value) {
      updateExerciseChart(exerciseData.value[selectedExercise.value])
    }
  }

  const { data: chartsData, status, refresh } = useCachedFetch<unknown, ChartsApiResponse>({
    url: API.GET_CHARTS_DATA,
    key: KEYS.CHARTS_DATA,
    transform: (payload) => payload as ChartsApiResponse,
    initialData: chartsState.value,
    cacheTime: 1000 * 60 * 5
  })

  watch(chartsData, (newData) => {
    if (!newData) return
    chartsState.value = newData
    processChartsData(newData)
  })

  onMounted(async () => {
    if (chartsState.value) {
      processChartsData(chartsState.value)
    }
    
    if (isInitialFetch.value) {
      try {
        await refresh()
        isInitialFetch.value = false
      } catch (error) {
        console.error('Failed to fetch charts data:', error)
      }
    }
  })

  const isLoading = computed(() => status.value === 'pending')

  function updateVolumeChart(data: ChartData[]) {
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

  function updateExerciseChart(data: ExerciseData[]) {
    exerciseChartOption.value = {
      tooltip: { trigger: 'axis' },
      legend: {
        data: [t('dashboard.maxWeight'), t('dashboard.avgWeight'), t('dashboard.setsCount')],
      },
      xAxis: {
        type: 'category',
        data: data.map((item: ExerciseData) => dayjs(item.date).format('DD.MM.YYYY')),
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
          data: data.map((item: ExerciseData) => item.maxWeight),
          smooth: true,
          lineStyle: { width: 3 },
          symbolSize: 8,
        },
        {
          name: t('dashboard.avgWeight'),
          type: 'line',
          data: data.map((item: ExerciseData) => Number(item.avgWeight.toFixed(1))),
          smooth: true,
          lineStyle: { width: 3 },
          symbolSize: 8,
        },
        {
          name: t('dashboard.setsCount'),
          type: 'bar',
          yAxisIndex: 1,
          data: data.map((item: ExerciseData) => item.setsCount),
          barWidth: '60%',
          itemStyle: { borderRadius: [8, 8, 0, 0] },
        },
      ],
    }
  }

  function updateDurationChart(data: DurationData[]) {
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

  function getExerciseName(exerciseId: string): string {
    if (!exercisesList.value) {
      return `Exercise ${exerciseId}`
    }

    const defaultExercise = exercisesList.value.find((e: ExerciseServerTemplate) => e.id === exerciseId)
    const userExercise = userExercisesList.value?.find((e: ExerciseServerTemplate) => e.id === exerciseId)

    return defaultExercise?.name || userExercise?.name || `Exercise ${exerciseId}`
  }

  const charts = computed<Array<{
    title: string
    option: ECBasicOption | null
    type: 'default' | 'exercise'
  }>>(() => [
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

  watch(() => selectedExercise.value, (newValue: string | null) => {
    if (newValue !== null && exerciseData.value[newValue]) {
      updateExerciseChart(exerciseData.value[newValue])
    }
  })

  return {
    charts,
    selectedExercise,
    popularExercises,
    getExerciseName,
    isLoading,
    refresh,
  }
}

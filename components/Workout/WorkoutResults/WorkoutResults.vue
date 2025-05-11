<script setup lang="ts">
import type { ChartType, CreateWorkoutResponse, MetricCharts } from '~/ts/interfaces'
import { KEYS } from '~/constants'

const props = defineProps<{
  workout: CreateWorkoutResponse
  selectedExerciseId: string | null
}>()

const { getExerciseData } = useWorkoutResults()
const { getProgressData } = useWorkoutResults()
const workouts = useState<CreateWorkoutResponse[]>(KEYS.GLOBAL_WORKOUTS)
const { t } = useI18n()

const chartOption = ref<MetricCharts[ChartType] | null>(null)
const selectedChartType = shallowRef<ChartType>('weight')
const chartInstance = ref<any | null>(null)

const chartTypes = readonly<Array<{ type: ChartType, label: string }>>([
  { type: 'weight', label: t('workout.weight') },
  { type: 'repeats', label: t('workout.repeats') },
  { type: 'time', label: t('workout.time') },
  { type: 'volume', label: t('workout.volume') },
])

function updateChart() {
  if (props.selectedExerciseId !== null && workouts.value) {
    const data = getExerciseData(props.workout, props.selectedExerciseId, workouts.value)
    chartOption.value = data[selectedChartType.value]

    nextTick()

    if (chartInstance.value) {
      chartInstance.value.resize()
    }
  }
}

function selectChartType(type: ChartType) {
  selectedChartType.value = type
  updateChart()
}

function onChartInit(chart: any) {
  chartInstance.value = chart
}

watch(() => props.selectedExerciseId, () => updateChart(), { immediate: true })

const progress = computed(() => {
  if (!props.selectedExerciseId || !props.workout || !workouts.value) {
    return null
  }

  return getProgressData(props.workout, props.selectedExerciseId, workouts.value)
})
</script>

<template>
  <div class="workout-results__charts-wr">
    <div class="workout-results__charts">
      <WorkoutProgress :progress />

      <div
        v-if="progress"
        class="chart-controls"
      >
        <TheButton
          v-for="chart in chartTypes"
          :key="chart.type"
          :variant="selectedChartType === chart.type ? 'primary' : 'secondary'"
          @click="selectChartType(chart.type)"
        >
          {{ chart.label }}
        </TheButton>
      </div>

      <div
        v-if="progress"
        class="chart-container"
      >
        <v-chart
          v-if="chartOption"
          class="chart"
          :option="chartOption"
          autoresize
          style="min-height: 250px"
          @init="onChartInit"
        />
      </div>
    </div>
  </div>
</template>

<style src="./style.css" />

<script setup lang="ts">
import type { ChartType, CreateWorkoutResponse, MetricCharts } from '~/ts/interfaces'

const props = defineProps<{
  workout: CreateWorkoutResponse
  originalWorkout: CreateWorkoutResponse
}>()

const { getWorkoutDifferenceData } = useWorkoutDifference()
const { t } = useI18n()

const chartOption = ref<MetricCharts[ChartType] | null>(null)
const selectedChartType = shallowRef<'weight' | 'repeats'>('weight')
const chartInstance = ref<any | null>(null)

const chartTypes = readonly<Array<{ type: 'weight' | 'repeats', label: string }>>([
  { type: 'weight', label: t('workout.weight') },
  { type: 'repeats', label: t('workout.repeats') },
])

function updateChart() {
  const data = getWorkoutDifferenceData(props.workout, props.originalWorkout)
  chartOption.value = data[selectedChartType.value]

  nextTick()

  if (chartInstance.value) {
    chartInstance.value.resize()
  }
}

function selectChartType(type: 'weight' | 'repeats') {
  selectedChartType.value = type
  updateChart()
}

function onChartInit(chart: any) {
  chartInstance.value = chart
}

watch(() => [props.workout, props.originalWorkout], () => {
  updateChart()
}, {
  immediate: true,
  deep: true,
})
</script>

<template>
  <div class="workout-difference-charts">
    <h3 class="workout-difference-title">
      {{ t('workout.difference_chart') }}
    </h3>

    <div class="chart-controls">
      <TheButton
        v-for="chart in chartTypes"
        :key="chart.type"
        :variant="selectedChartType === chart.type ? 'primary' : 'secondary'"
        @click="selectChartType(chart.type)"
      >
        {{ chart.label }}
      </TheButton>
    </div>

    <div class="chart-container">
      <v-chart
        v-if="chartOption"
        class="chart"
        :option="chartOption"
        autoresize
        style="min-height: 250px"
        @init="onChartInit"
      />
      <div v-else class="no-data">
        {{ t('workout.no_difference_data') }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.workout-difference-charts {
  margin-top: 20px;
  padding: 15px;
  background-color: var(--color-white);
  border-radius: 8px;
}

.workout-difference-title {
  margin-top: 0;
  margin-bottom: 15px;
  font-size: 18px;
  font-weight: 600;
}

.chart-controls {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
}

.chart-container {
  width: 100%;
  min-height: 250px;
  background-color: var(--color-white);
  border-radius: 8px;
  overflow: hidden;
}

.chart {
  width: 100%;
  height: 100%;
}

.no-data {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 250px;
  color: var(--color-white);
}
</style>

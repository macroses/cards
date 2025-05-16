<script setup lang="ts">
import type { ChartType, CreateWorkoutResponse, MetricCharts } from '~/ts/interfaces'

const props = defineProps<{
  workout: CreateWorkoutResponse
  originalWorkout: CreateWorkoutResponse
  activeExerciseId: string | null
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
  const data = getWorkoutDifferenceData(props.workout, props.originalWorkout, props.activeExerciseId)
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

watch(() => [
  props.workout,
  props.originalWorkout,
  props.activeExerciseId,
], () => {
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

<style scoped src="./style.css" />

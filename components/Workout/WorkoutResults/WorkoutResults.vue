<script setup lang="ts">
import type { ChartType, CreateWorkoutResponse, MetricCharts } from '~/ts/interfaces'
import { watchImmediate } from '@vueuse/core'
import { KEYS } from '~/constants'

interface WorkoutResultsProps {
  workout: CreateWorkoutResponse
  selectedExerciseId: string | null
}

const props = defineProps<WorkoutResultsProps>()

const { getExerciseData } = useWorkoutResults()
const workouts = useState<CreateWorkoutResponse[] | null>(KEYS.GLOBAL_WORKOUTS)
const { t } = useI18n()

const chartOption = ref<MetricCharts[ChartType] | null>(null)
const selectedChartType = ref<ChartType>('weight')
const chartInstance = ref<any>(null)

const chartTypes = ref<Array<{ type: ChartType, label: string }>>([
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

watchImmediate(() => props.selectedExerciseId, () => updateChart())
</script>

<template>
  <div class="workout-results__charts">
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
        style="height: 100%"
        @init="onChartInit"
      />
    </div>

    <WorkoutProgress
      v-if="workouts"
      :workout="workout"
      :workouts="workouts"
      :selected-exercise-id="selectedExerciseId"
    />
  </div>
</template>

<style src="./style.css" />

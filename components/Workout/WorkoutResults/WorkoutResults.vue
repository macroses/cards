<script setup lang="ts">
import { GLOBAL_WORKOUTS } from '~/constants'
import type { CreateWorkoutResponse } from '~/ts/interfaces/createWorkout.interface'

interface WorkoutResultsProps {
  workout: CreateWorkoutResponse
  selectedExerciseId: number | null
}

const props = defineProps<WorkoutResultsProps>()
const { getExerciseData } = useWorkoutResults()
const workouts = useState<CreateWorkoutResponse[] | null>(GLOBAL_WORKOUTS)

const chartOption = ref<any>(null)
const selectedChartType = ref<'weight' | 'repeats' | 'time'>('weight')
const chartInstance = ref<any>(null)

async function updateChart() {
  if (props.selectedExerciseId !== null && workouts.value) {
    const data = getExerciseData(props.workout, props.selectedExerciseId, workouts.value)
    chartOption.value = data[selectedChartType.value]

    await nextTick()

    if (chartInstance.value) {
      chartInstance.value.resize()
    }
  }
}

function selectChartType(type: 'weight' | 'repeats' | 'time') {
  selectedChartType.value = type
  updateChart()
}

function onChartInit(chart: any) {
  chartInstance.value = chart
}

watch(() => props.selectedExerciseId, () => {
  updateChart()
}, { immediate: true })
</script>

<template>
  <div class="workout-results__charts">
    <div class="chart-controls">
      <TheButton
        :variant="selectedChartType === 'weight' ? 'primary' : 'secondary'"
        @click="selectChartType('weight')"
      >
        {{ $t('workout.weight') }}
      </TheButton>
      <TheButton
        :variant="selectedChartType === 'repeats' ? 'primary' : 'secondary'"
        @click="selectChartType('repeats')"
      >
        {{ $t('workout.repeats') }}
      </TheButton>
      <TheButton
        :variant="selectedChartType === 'time' ? 'primary' : 'secondary'"
        @click="selectChartType('time')"
      >
        {{ $t('workout.time') }}
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

<style scoped>
.workout-results__charts {
  flex: 3;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.chart-controls {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.chart-container {
  flex: 1;
  max-height: 350px;
  min-height: 350px;
}

.chart {
  height: 100%;
}
</style>

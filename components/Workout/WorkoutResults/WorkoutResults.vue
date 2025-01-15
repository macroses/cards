<script setup lang="ts">
import type { CreateWorkoutResponse } from '~/ts/interfaces/createWorkout.interface'

interface WorkoutResultsProps {
  workout: CreateWorkoutResponse
  selectedExerciseId: number | null
}

const props = defineProps<WorkoutResultsProps>()
const { getExerciseData } = useWorkoutResults()

const chartOption = ref<any>(null)
const selectedChartType = ref<'weight' | 'repeats' | 'time'>('weight')
const chartInstance = ref<any>(null)

async function updateChart() {
  if (props.selectedExerciseId !== null) {
    const data = getExerciseData(props.workout, props.selectedExerciseId)
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
  <div class="workout-results">
    <div class="workout-results__content">
      <!--      <div class="workout-results__exercises"> -->
      <!--        <ul class="workout-results__exercises-list"> -->
      <!--          <li -->
      <!--            v-for="exercise in workout.exercises" -->
      <!--            :key="exercise.exerciseId" -->
      <!--            class="workout-results__exercise-item" -->
      <!--            :class="{ active: props.selectedExerciseId === exercise.exerciseId }" -->
      <!--          > -->
      <!--            {{ exercise.exerciseName }} -->
      <!--          </li> -->
      <!--        </ul> -->
      <!--      </div> -->
      <div class="workout-results__chart-container">
        <div class="workout-results__chart-controls">
          <button
            class="workout-results__chart-button"
            :class="{ active: selectedChartType === 'weight' }"
            @click="selectChartType('weight')"
          >
            <TheIcon
              icon-name="weight-hanging"
              width="14px"
            />
            Weight
          </button>
          <button
            class="workout-results__chart-button"
            :class="{ active: selectedChartType === 'repeats' }"
            @click="selectChartType('repeats')"
          >
            <TheIcon
              icon-name="repeat"
              width="14px"
            />
            Repeats
          </button>
          <button
            class="workout-results__chart-button"
            :class="{ active: selectedChartType === 'time' }"
            @click="selectChartType('time')"
          >
            <TheIcon
              icon-name="clock"
              width="14px"
            />
            Time
          </button>
        </div>
        <div class="workout-results__chart">
          <VChart
            v-if="chartOption"
            :option="chartOption"
            autoresize
            @init="onChartInit"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.workout-results {
  padding: 20px;
  width: 100%;
}

.workout-results__content {
  display: flex;
  gap: 20px;
  width: 100%;
  position: sticky;
  top: 0;
}

.workout-results__exercises {
  width: 200px;
  flex-shrink: 0;
}

.workout-results__exercises-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.workout-results__exercise-item {
  padding: 10px;
  cursor: pointer;
  border-radius: 8px;
  transition: background-color 0.2s;
}

.workout-results__exercise-item:hover {
  background-color: var(--table-dark-bg);
}

.workout-results__exercise-item.active {
  color: blue;
}

.workout-results__chart-container {
  flex: 1;
  min-width: 0; /* Важно для корректной работы flexbox */
}

.workout-results__chart-controls {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.workout-results__chart-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  background-color: var(--table-dark-bg);
  color: inherit;
  cursor: pointer;
  transition: all 0.2s;
}

.workout-results__chart-button.active {
  color: white;
}

.workout-results__chart {
  width: 100%;
  height: 400px;
}
</style>

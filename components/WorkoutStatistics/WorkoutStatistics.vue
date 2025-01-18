<script setup lang="ts">
import { GLOBAL_WORKOUTS } from '~/constants'
import type { CreateWorkoutResponse } from '~/ts/interfaces'

const workouts = useState<CreateWorkoutResponse[]>(GLOBAL_WORKOUTS)
const { t } = useI18n()
const {
  getGeneralStats,
  getMostFrequentExercises,
  getExerciseStats,
  getWeightProgressChartData,
  getActiveDaysChart,
  getMonthlyProgressChart,
} = useWorkoutStatistics()

const selectedExerciseId = ref<number | null>(null)
const chartInstance = ref<any>(null)
const difficultyChartInstance = ref<any>(null)
const selectedChartType = ref('activity') // 'activity' | 'exercises'

const generalStats = computed(() => {
  if (!workouts.value)
    return null
  return getGeneralStats(workouts.value)
})

const frequentExercises = computed(() => {
  if (!workouts.value) {
    return []
  }

  return getMostFrequentExercises(workouts.value)
})

const selectedExerciseStats = computed(() => {
  if (!workouts.value || selectedExerciseId.value === null) {
    return null
  }

  return getExerciseStats(workouts.value, selectedExerciseId.value)
})

const weightProgressChart = computed(() => {
  if (!workouts.value || selectedExerciseId.value === null) {
    return null
  }

  return getWeightProgressChartData(workouts.value, selectedExerciseId.value)
})

const activeDaysChart = computed(() => {
  if (!workouts.value) {
    return null
  }

  return getActiveDaysChart(workouts.value)
})

const monthlyProgressChart = computed(() => {
  if (!workouts.value) {
    return null
  }

  return getMonthlyProgressChart(workouts.value)
})

function selectExercise(exerciseId: number) {
  selectedExerciseId.value = exerciseId
}

function onChartInit(chart: any) {
  chartInstance.value = chart
}

function onDifficultyChartInit(chart: any) {
  difficultyChartInstance.value = chart
}

watch(selectedExerciseId, () => {
  nextTick(() => {
    if (chartInstance.value) {
      chartInstance.value.resize()
    }
    if (difficultyChartInstance.value) {
      difficultyChartInstance.value.resize()
    }
  })
})
</script>

<template>
  <div class="workout-statistics">
    <div v-if="generalStats" class="statistics-section general-stats">
      <h3>{{ t('statistics.generalStats') }}</h3>
      <div class="stats-grid">
        <div class="stat-item">
          <span class="stat-label">{{ t('statistics.totalWorkouts') }}</span>
          <span class="stat-value">{{ generalStats.totalWorkouts }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">{{ t('statistics.completedWorkouts') }}</span>
          <span class="stat-value">{{ generalStats.completedWorkouts }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">{{ t('statistics.completionRate') }}</span>
          <span class="stat-value">{{ generalStats.completionRate }}%</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">{{ t('statistics.averageDuration') }}</span>
          <span class="stat-value">{{ generalStats.averageDuration }} {{ t('statistics.minutes') }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">{{ t('statistics.longestStreak') }}</span>
          <span class="stat-value">{{ generalStats.longestStreak }} {{ t('statistics.days') }}</span>
        </div>
      </div>
    </div>

    <!--    <div class="statistics-section"> -->
    <!--      <h3>{{ t('statistics.monthlyProgress') }}</h3> -->
    <!--      <div class="chart-container"> -->
    <!--        <v-chart -->
    <!--          v-if="monthlyProgressChart" -->
    <!--          class="chart" -->
    <!--          :option="monthlyProgressChart" -->
    <!--          autoresize -->
    <!--          style="height: 300px" -->
    <!--        /> -->
    <!--      </div> -->
    <!--    </div> -->

    <div class="statistics-section">
      <div class="chart-header">
        <div class="chart-tabs">
          <button
            :class="{ active: selectedChartType === 'activity' }"
            @click="selectedChartType = 'activity'"
          >
            {{ t('statistics.activeDays') }}
          </button>
          <button
            :class="{ active: selectedChartType === 'exercises' }"
            @click="selectedChartType = 'exercises'"
          >
            {{ t('statistics.frequentExercises') }}
          </button>
        </div>
      </div>

      <div v-if="selectedChartType === 'activity'" class="chart-container">
        <v-chart
          v-if="activeDaysChart"
          class="chart"
          :option="activeDaysChart"
          autoresize
          style="height: 300px"
        />
      </div>

      <div v-else class="exercise-list-container">
        <ul class="exercise-list">
          <li
            v-for="exercise in frequentExercises"
            :key="exercise.id"
            :class="{ active: selectedExerciseId === exercise.id }"
            @click="selectExercise(exercise.id)"
          >
            {{ exercise.name }} ({{ exercise.count }})
          </li>
        </ul>
      </div>
    </div>

    <template v-if="selectedExerciseId && selectedExerciseStats">
      <div class="statistics-section">
        <h3>{{ t('statistics.exerciseStats') }}</h3>
        <div class="stats-grid">
          <div class="stat-item">
            <span class="stat-label">{{ t('statistics.maxWeight') }}</span>
            <span class="stat-value">{{ selectedExerciseStats.maxWeight }} {{ t('statistics.kg') }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">{{ t('statistics.avgWeight') }}</span>
            <span class="stat-value">{{ selectedExerciseStats.avgWeight }} {{ t('statistics.kg') }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">{{ t('statistics.avgRepeats') }}</span>
            <span class="stat-value">{{ selectedExerciseStats.avgRepeats }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">{{ t('statistics.totalSets') }}</span>
            <span class="stat-value">{{ selectedExerciseStats.totalSets }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">{{ t('statistics.completedSets') }}</span>
            <span class="stat-value">{{ selectedExerciseStats.completedSets }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">{{ t('statistics.completionRate') }}</span>
            <span class="stat-value">{{ selectedExerciseStats.completionRate }}%</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">{{ t('statistics.avgRestTime') }}</span>
            <span class="stat-value">{{ selectedExerciseStats.avgRestTime }} {{ t('statistics.seconds') }}</span>
          </div>
        </div>
      </div>

      <div class="statistics-section chart-section">
        <h3>{{ t('statistics.weightProgress') }}</h3>
        <div class="chart-container">
          <v-chart
            v-if="weightProgressChart"
            class="chart"
            :option="weightProgressChart"
            autoresize
            style="height: 300px"
            @init="onChartInit"
          />
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.workout-statistics {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.statistics-section {
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.statistics-section h3 {
  margin-bottom: 1.5rem;
  font-size: 1.2rem;
  font-weight: 600;
}

.exercise-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.exercise-list li {
  padding: 0.75rem 1rem;
  margin-bottom: 0.5rem;
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1rem;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 1.5rem;
  border-radius: 12px;
  transition: transform 0.2s ease;
}

.stat-label {
  font-size: 0.9rem;
  margin-bottom: 0.75rem;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: bold;
}

.chart-container {
  width: 100%;
  height: 300px;
  margin-top: 1rem;
  border-radius: 8px;
  overflow: hidden;
}

.general-stats .stat-item {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  transition: transform 0.2s ease;
}

.chart-header {
  margin-bottom: 1rem;
}

.chart-tabs {
  display: flex;
  gap: 0.5rem;
  padding: 0.25rem;
  background: var(--color-background);
  border-radius: 8px;
}

.chart-tabs button {
  flex: 1;
  padding: 0.75rem 1rem;
  border: none;
  background: none;
  border-radius: 6px;
  color: var(--color-text);
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.chart-tabs button:hover {
  background: var(--color-background-mute);
}

.chart-tabs button.active {
  background: var(--color-primary);
  color: white;
}

.exercise-list-container {
  height: 300px;
  overflow-y: auto;
  padding-right: 0.5rem;
}

.exercise-list-container::-webkit-scrollbar {
  width: 6px;
}

.exercise-list-container::-webkit-scrollbar-track {
  background: var(--color-background);
  border-radius: 3px;
}

.exercise-list-container::-webkit-scrollbar-thumb {
  background: var(--color-background-mute);
  border-radius: 3px;
}

.exercise-list-container::-webkit-scrollbar-thumb:hover {
  background: var(--color-primary);
}
</style>

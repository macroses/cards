<script setup lang="ts">
import type { CreateWorkoutResponse, ExerciseServerTemplate, WorkoutSet } from '~/ts/interfaces'

interface Props {
  workouts: CreateWorkoutResponse[]
}

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

const props = defineProps<Props>()
const { t } = useI18n()
const dayjs = useDayjs()

// Получаем список упражнений
const { exercisesList } = useFetchExercisesList()

// Состояния для графиков
const volumeChartOption = ref<any>(null)
const exerciseChartOption = ref<any>(null)
const durationChartOption = ref<any>(null)
const selectedExercise = ref<number | null>(null)
const popularExercises = ref<number[]>([])

// Получение данных для графиков
function calculateVolumeAndIntensity() {
  if (!props.workouts?.length)
    return

  const data: ChartData[] = props.workouts.map((workout: CreateWorkoutResponse) => {
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
      volume: totalVolume / 1000, // конвертируем в тонны
      intensity,
    }
  })

  volumeChartOption.value = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
      },
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
        itemStyle: {
          borderRadius: [8, 8, 0, 0],
        },
      },
      {
        name: t('dashboard.intensity'),
        type: 'line',
        yAxisIndex: 1,
        data: data.map((item: ChartData) => Number(item.intensity.toFixed(2))),
        smooth: true,
        lineStyle: {
          width: 3,
        },
        symbolSize: 8,
      },
    ],
  }
}

function updateExerciseChart() {
  if (!selectedExercise.value || !props.workouts?.length)
    return

  const exerciseData = props.workouts.map((workout: CreateWorkoutResponse) => {
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
    tooltip: {
      trigger: 'axis',
    },
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
        lineStyle: {
          width: 3,
        },
        symbolSize: 8,
      },
      {
        name: t('dashboard.avgWeight'),
        type: 'line',
        data: exerciseData.map((item: ExerciseData) => Number(item.avgWeight.toFixed(1))),
        smooth: true,
        lineStyle: {
          width: 3,
        },
        symbolSize: 8,
      },
      {
        name: t('dashboard.setsCount'),
        type: 'bar',
        yAxisIndex: 1,
        data: exerciseData.map((item: ExerciseData) => item.setsCount),
        barWidth: '60%',
        itemStyle: {
          borderRadius: [8, 8, 0, 0],
        },
      },
    ],
  }
}

function calculateDurationChart() {
  if (!props.workouts?.length)
    return

  const data: DurationData[] = props.workouts.map((workout: CreateWorkoutResponse) => {
    const duration = workout.sets.reduce((sum: number, set: WorkoutSet) => {
      return sum + (set.setTime || 0)
    }, 0)

    const avgSetTime = workout.sets.reduce((sum: number, set: WorkoutSet) => {
      return sum + (set.setTime || 0)
    }, 0) / workout.sets.length

    return {
      date: workout.workoutDate,
      duration,
      avgSetTime,
    }
  })

  durationChartOption.value = {
    tooltip: {
      trigger: 'axis',
    },
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
        itemStyle: {
          borderRadius: [8, 8, 0, 0],
        },
      },
      {
        name: t('dashboard.avgSetTime'),
        type: 'line',
        data: data.map((item: DurationData) => Number(item.avgSetTime.toFixed(1))),
        smooth: true,
        lineStyle: {
          width: 3,
        },
        symbolSize: 8,
      },
    ],
  }
}

function calculatePopularExercises() {
  if (!props.workouts?.length)
    return

  const exerciseCounts: Record<number, number> = {}

  props.workouts.forEach((workout: CreateWorkoutResponse) => {
    workout.exercises.forEach((exercise) => {
      if (exercise.exerciseId) {
        exerciseCounts[exercise.exerciseId] = (exerciseCounts[exercise.exerciseId] || 0) + 1
      }
    })
  })

  popularExercises.value = Object.entries(exerciseCounts)
    .sort(([, a], [, b]) => (b || 0) - (a || 0))
    .slice(0, 10)
    .map(([id]) => Number.parseInt(id))

  // Выбираем первое упражнение по умолчанию, если еще не выбрано
  if (!selectedExercise.value && popularExercises.value.length > 0)
    selectedExercise.value = popularExercises.value[0]
}

// Функция для получения названия упражнения по ID
function getExerciseName(exerciseId: number): string {
  for (const group of exercisesList.value || []) {
    const exercise = group.exercises.find((e: ExerciseServerTemplate) => e.id === exerciseId)
    if (exercise)
      return exercise.name
  }
  return `Exercise ${exerciseId}`
}

// Инициализация графиков при изменении тренировок
watch(() => props.workouts, () => {
  calculateVolumeAndIntensity()
  calculatePopularExercises()
  calculateDurationChart()
}, { immediate: true })

// Обновление графика упражнения при выборе нового упражнения
watch(() => selectedExercise.value, () => {
  updateExerciseChart()
}, { immediate: true })
</script>

<template>
  <div class="dashboard-charts">
    <!-- График объема и интенсивности -->
    <div class="chart-container">
      <h3>{{ t('dashboard.volumeAndIntensity') }}</h3>
      <v-chart
        v-if="volumeChartOption"
        class="chart"
        :option="volumeChartOption"
        autoresize
      />
    </div>

    <!-- График упражнений -->
    <div class="chart-container">
      <h3>{{ t('dashboard.exerciseProgress') }}</h3>
      <div class="exercise-chart-container">
        <div class="exercise-list">
          <button
            v-for="exerciseId in popularExercises"
            :key="exerciseId"
            class="exercise-button"
            :class="{ active: selectedExercise === exerciseId }"
            @click="selectedExercise = exerciseId"
          >
            {{ getExerciseName(exerciseId) }}
          </button>
        </div>
        <v-chart
          v-if="exerciseChartOption"
          class="chart"
          :option="exerciseChartOption"
          autoresize
        />
      </div>
    </div>

    <!-- График продолжительности -->
    <div class="chart-container">
      <h3>{{ t('dashboard.durationAndSetTime') }}</h3>
      <v-chart
        v-if="durationChartOption"
        class="chart"
        :option="durationChartOption"
        autoresize
      />
    </div>
  </div>
</template>

<style scoped>
.dashboard-charts {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.chart-container {
  border-radius: 8px;
  padding: 1rem;
}

.chart {
  height: 300px;
  width: 100%;
}

.exercise-chart-container {
  display: flex;
  gap: 1rem;
}

.exercise-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-width: 150px;
}

.exercise-button {
  padding: 0.5rem;
  border-radius: 4px;
  background: none;
  cursor: pointer;
  text-align: left;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
}

.exercise-button.active {
  color: blueviolet;
}

h3 {
  margin-bottom: 1rem;
}
</style>

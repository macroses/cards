<script setup lang="ts">
import dayjs from 'dayjs'
import type { CreateWorkoutResponse } from '~/ts/interfaces/createWorkout.interface'

interface WorkoutProgressProps {
  workout: CreateWorkoutResponse
  workouts: CreateWorkoutResponse[]
  selectedExerciseId: number | null
}

const props = defineProps<WorkoutProgressProps>()
const { getProgressData } = useWorkoutResults()
const { t } = useI18n()

const progress = computed(() => {
  if (!props.selectedExerciseId || !props.workout || !props.workouts) {
    return null
  }

  return getProgressData(props.workout, props.selectedExerciseId, props.workouts)
})

function formatChange(value: number): string {
  const sign = value > 0 ? '+' : ''

  return `${sign}${value.toFixed(1)}%`
}

function formatTime(seconds: number): string {
  return dayjs.duration(seconds, 'seconds').format('mm:ss')
}
</script>

<template>
  <div v-if="progress" class="workout-progress">
    <h3 class="workout-progress__title">
      {{ t('workout.progress_comparison') }}
      <span class="workout-progress__date">
        ({{ dayjs(progress.previousWorkoutDate).format('DD.MM.YYYY') }})
      </span>
    </h3>

    <div class="workout-progress__metrics">
      <div class="workout-progress__metric">
        <div class="metric__label">
          {{ t('workout.weight') }}
        </div>
        <div class="metric__values">
          <div class="metric__group">
            <div class="metric__subtitle">
              {{ t('workout.average') }}
            </div>
            <div class="metric__current">
              {{ progress.weight.current.toFixed(1) }}
            </div>
            <div
              class="metric__change"
              :class="{
                'metric__change--positive': progress.weight.change > 0,
                'metric__change--negative': progress.weight.change < 0,
              }"
            >
              {{ formatChange(progress.weight.change) }}
            </div>
          </div>
          <div class="metric__group">
            <div class="metric__subtitle">
              {{ t('workout.maximum') }}
            </div>
            <div class="metric__current">
              {{ progress.weight.max.current.toFixed(1) }}
            </div>
            <div
              class="metric__change"
              :class="{
                'metric__change--positive': progress.weight.max.change > 0,
                'metric__change--negative': progress.weight.max.change < 0,
              }"
            >
              {{ formatChange(progress.weight.max.change) }}
            </div>
          </div>
        </div>
      </div>

      <div class="workout-progress__metric">
        <div class="metric__label">
          {{ t('workout.repeats') }}
        </div>
        <div class="metric__values">
          <div class="metric__group">
            <div class="metric__subtitle">
              {{ t('workout.average') }}
            </div>
            <div class="metric__current">
              {{ progress.repeats.current.toFixed(1) }}
            </div>
            <div
              class="metric__change"
              :class="{
                'metric__change--positive': progress.repeats.change > 0,
                'metric__change--negative': progress.repeats.change < 0,
              }"
            >
              {{ formatChange(progress.repeats.change) }}
            </div>
          </div>
          <div class="metric__group">
            <div class="metric__subtitle">
              {{ t('workout.maximum') }}
            </div>
            <div class="metric__current">
              {{ progress.repeats.max.current }}
            </div>
            <div
              class="metric__change"
              :class="{
                'metric__change--positive': progress.repeats.max.change > 0,
                'metric__change--negative': progress.repeats.max.change < 0,
              }"
            >
              {{ formatChange(progress.repeats.max.change) }}
            </div>
          </div>
        </div>
      </div>

      <div class="workout-progress__metric">
        <div class="metric__label">
          {{ t('workout.time') }}
        </div>
        <div class="metric__values">
          <div class="metric__group">
            <div class="metric__subtitle">
              {{ t('workout.average') }}
            </div>
            <div class="metric__current">
              {{ formatTime(progress.time.current) }}
            </div>
            <div
              class="metric__change"
              :class="{
                'metric__change--positive': progress.time.change > 0,
                'metric__change--negative': progress.time.change < 0,
              }"
            >
              {{ formatChange(progress.time.change) }}
            </div>
          </div>
          <div class="metric__group">
            <div class="metric__subtitle">
              {{ t('workout.maximum') }}
            </div>
            <div class="metric__current">
              {{ formatTime(progress.time.max.current) }}
            </div>
            <div
              class="metric__change"
              :class="{
                'metric__change--positive': progress.time.max.change > 0,
                'metric__change--negative': progress.time.max.change < 0,
              }"
            >
              {{ formatChange(progress.time.max.change) }}
            </div>
          </div>
        </div>
      </div>

      <div class="workout-progress__metric">
        <div class="metric__label">
          {{ t('workout.volume') }}
        </div>
        <div class="metric__values">
          <div class="metric__group">
            <div class="metric__subtitle">
              {{ t('workout.average') }}
            </div>
            <div class="metric__current">
              {{ progress.volume.current.toFixed(0) }}
            </div>
            <div
              class="metric__change"
              :class="{
                'metric__change--positive': progress.volume.change > 0,
                'metric__change--negative': progress.volume.change < 0,
              }"
            >
              {{ formatChange(progress.volume.change) }}
            </div>
          </div>
          <div class="metric__group">
            <div class="metric__subtitle">
              {{ t('workout.maximum') }}
            </div>
            <div class="metric__current">
              {{ progress.volume.max.current.toFixed(0) }}
            </div>
            <div
              class="metric__change"
              :class="{
                'metric__change--positive': progress.volume.max.change > 0,
                'metric__change--negative': progress.volume.max.change < 0,
              }"
            >
              {{ formatChange(progress.volume.max.change) }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <p
    v-else
    class="workout-progress__empty"
  >
    {{ $t('workout.no_data') }}
  </p>
</template>

<style scoped>
.workout-progress {
  border-radius: 12px;
  margin-top: -40px;
  border: 1px solid rgb(var(--border-color));
  overflow: hidden;
}

.workout-progress__empty {
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 12px;
  margin-top: -40px;
  border: 1px solid rgb(var(--border-color));
}

.workout-progress__title {
  padding: 12px;
  font-size: 14px;
  background-color: rgb(var(--accent-color) / 0.1);
}

.workout-progress__date {
  font-size: 14px;
}

.workout-progress__metrics {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  justify-content: space-between;
  padding-bottom: 8px;
}

.workout-progress__metric {
  border-radius: 6px;
}

.metric__label {
  font-size: 14px;
  font-weight: 500;
  padding-block: 4px;
  margin-bottom: 8px;
  text-align: center;
  background-color: var(--table-dark-bg);
}

.metric__values {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-left: 24px;
}

.metric__group {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.metric__subtitle {
  font-size: 12px;
}

.metric__current {
  font-size: 12px;
  font-weight: 600;
}

.metric__change {
  font-size: 14px;
  font-weight: 500;
}

.metric__change--positive {
  color: var(--difficulty-2);
}

.metric__change--negative {
  color: var(--difficulty-4);
}
</style>

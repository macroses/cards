<script setup lang="ts">
import type { CreateWorkoutResponse } from '~/ts/interfaces'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'

const props = defineProps<{
  selectedWorkout: CreateWorkoutResponse | null
  selectedExerciseId: string | null
}>()

const emit = defineEmits<{
  (e: 'update:selectedExerciseId', id: string): void
}>()

dayjs.extend(duration)

const { getExerciseSets } = useExerciseSets()
const isMobile = useMediaQuery('(max-width: 768px)')
const isChartsVisible = ref(false)

const exerciseSets = computed(() => {
  if (!props.selectedWorkout) {
    return {}
  }

  const groupedSets = getExerciseSets(props.selectedWorkout)
  const result: Record<string, CreateWorkoutResponse['sets']> = {}

  for (const [exerciseId, data] of Object.entries(groupedSets)) {
    result[exerciseId] = data.sets
  }

  return result
})

function handleExerciseClick(exerciseId: string) {
  emit('update:selectedExerciseId', exerciseId)

  if (isMobile.value) {
    isChartsVisible.value = true
  }
}

function handleBackClick() {
  isChartsVisible.value = false
}

function setTime(time: number | null | undefined): string {
  if (!time) {
    return ''
  }

  return dayjs.duration(time, 'seconds').format('mm:ss')
}
</script>

<template>
  <div
    class="workout-results__container"
    :class="{ 'mobile-charts-visible': isMobile && isChartsVisible }"
  >
    <div class="workout-results__wr">
      <ul class="workout-results__sets-header">
        <li>Level</li>
        <li>Weight</li>
        <li>Repeats</li>
        <li>Time</li>
      </ul>
      <ul class="workout-results">
        <li
          v-for="exercise in selectedWorkout?.exercises"
          :key="exercise.exerciseId"
          class="workout-results__exercise"
          :class="{ active: selectedExerciseId === exercise.exerciseId }"
          @click="handleExerciseClick(exercise.exerciseId)"
        >
          <div
            class="workout-results__exercise-name"
            :class="{ active: selectedExerciseId === exercise.exerciseId }"
            @click="handleExerciseClick(exercise.exerciseId)"
          >
            {{ exercise.exerciseName }}
          </div>
          <div class="workout-results__sets">
            <ul
              v-for="set in exerciseSets[exercise.exerciseId]"
              :key="set.id"
              class="workout-results__set"
            >
              <li class="workout-results__set-difficulty">
                <span :class="`difficulty-${set.difficulty}`" />
              </li>
              <li>{{ set.weight }}</li>
              <li>{{ set.repeats }}</li>
              <li>{{ setTime(set.setTime) }}</li>
            </ul>
          </div>
        </li>
      </ul>
    </div>

    <div class="workout-results__charts-container">
      <button
        v-if="isMobile"
        class="workout-results__back-button"
        @click="handleBackClick"
      >
        ← Back to exercises
      </button>

      <WorkoutResults
        v-if="selectedWorkout"
        :workout="selectedWorkout"
        :selected-exercise-id="selectedExerciseId"
      />
    </div>
  </div>
</template>

<style src='./style.css' />

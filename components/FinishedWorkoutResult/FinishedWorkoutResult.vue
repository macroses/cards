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
}

function setTime(time: number | null | undefined): string {
  if (!time) {
    return ''
  }

  return dayjs.duration(time, 'seconds').format('mm:ss')
}
</script>

<template>
  <div class="workout-results__container">
    <div class="workout-results__wr">
      <ul class="workout-results">
        <li
          v-for="exercise in selectedWorkout?.exercises"
          :key="exercise.exerciseId"
          class="workout-results__exercise"
        >
          <div
            class="workout-results__exercise-name"
            :class="{ active: selectedExerciseId === exercise.exerciseId }"
            @click="handleExerciseClick(exercise.exerciseId)"
          >
            {{ exercise.exerciseName }}
            <TheButton
              v-if="selectedExerciseId !== exercise.exerciseId"
              variant="secondary"
              icon-only
              @click="handleExerciseClick(exercise.exerciseId)"
            >
              <TheIcon
                icon-name="angle-right"
                width="20px"
              />
            </TheButton>
          </div>
          <div class="workout-results__sets">
            <ul class="workout-results__sets-header">
              <li>Weight</li>
              <li>Repeats</li>
              <li>Time</li>
            </ul>
            <ul
              v-for="set in exerciseSets[exercise.exerciseId]"
              :key="set.id"
              class="workout-results__set"
              :class="`difficulty-${set.difficulty}`"
            >
              <li>{{ set.weight }}</li>
              <li>{{ set.repeats }}</li>
              <li>{{ setTime(set.setTime) }}</li>
            </ul>
          </div>
        </li>
      </ul>
    </div>

    <WorkoutResults
      v-if="selectedWorkout"
      :workout="selectedWorkout"
      :selected-exercise-id="selectedExerciseId"
    />
  </div>
</template>

<style src='./style.css' />

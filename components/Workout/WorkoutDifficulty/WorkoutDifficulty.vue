<script setup lang="ts">
import { DifficultSet } from '../WorkoutExercises/workoutExerciseTypes'

const difficulty = defineModel<DifficultSet>({
  default: DifficultSet.warm,
})

const difficulties = [
  { value: DifficultSet.warm, label: '1' },
  { value: DifficultSet.low, label: '2' },
  { value: DifficultSet.medium, label: '3' },
  { value: DifficultSet.high, label: '4' },
  { value: DifficultSet.maximum, label: '5' },
]
</script>

<template>
  <div
    class="difficulty-buttons"
    :data-difficulty="difficulty"
  >
    <button
      v-for="level in difficulties"
      :key="level.value"
      type="button"
      class="difficulty-button"
      :class="{ active: difficulty === level.value }"
      @click="difficulty = level.value"
    >
      {{ level.label }}
    </button>
  </div>
</template>

<style src="./style.css" />

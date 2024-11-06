<script setup lang="ts">
import { DifficultSet } from '../WorkoutExercises/workoutExerciseTypes'

const difficulty = defineModel<DifficultSet>({
  default: DifficultSet.warm,
})

const difficulties = [
  { value: DifficultSet.warm, label: '1', color: '#ececec' },
  { value: DifficultSet.low, label: '2', color: '#00c420' },
  { value: DifficultSet.medium, label: '3', color: '#ffcb29' },
  { value: DifficultSet.high, label: '4', color: '#ff9494' },
  { value: DifficultSet.maximum, label: '5', color: '#e12525' },
]
</script>

<template>
  <div class="difficulty-buttons">
    <button
      v-for="level in difficulties"
      :key="level.value"
      class="difficulty-button"
      :class="{ active: difficulty === level.value }"
      :style="{ backgroundColor: level.color }"
      @click="difficulty = level.value"
    >
      {{ level.label }}
    </button>
  </div>
</template>

<style src="./style.css" />

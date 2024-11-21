<script setup lang="ts">
import type { UserTrainingSession } from '~/ts/interfaces'

defineProps<{
  sessions: UserTrainingSession[]
  selectedExercisesLength: number
}>()
</script>

<template>
  <div
    v-auto-animate
    class="workout-exercises__top"
  >
    <div
      v-if="calculateTonnage(sessions) > 0"
      class="workout-total"
    >
      Total tonnage: {{ (calculateTonnage(sessions)).toFixed(2) }} T
    </div>
  </div>
</template>

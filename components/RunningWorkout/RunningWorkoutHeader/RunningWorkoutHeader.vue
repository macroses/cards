<script setup lang="ts">
defineProps<{
  title: string
  workoutDate: string
}>()

const { timer } = useWorkoutTimer()
</script>

<template>
  <div class="workout-description">
    <h2 class="workout-header">
      {{ title }}
    </h2>
    <div>{{ workoutDate }}</div>

    <TheButton
      variant="success"
      inert
      class="workout-description__odometer"
    >
      <OdometerTimer :time="timer" />
    </TheButton>
  </div>
</template>

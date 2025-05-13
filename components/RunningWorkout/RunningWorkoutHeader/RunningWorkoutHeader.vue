<script setup lang="ts">
defineProps<{
  title: string
  workoutDate: string
  isDescriptionVisible: boolean
}>()

const { timer } = useWorkoutTimer()
</script>

<template>
  <div
    class="workout-description"
    :class="{ hidden: !isDescriptionVisible }"
  >
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

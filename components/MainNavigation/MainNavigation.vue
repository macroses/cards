<script setup lang="ts">
const localePath = useLocalePath()
const { timer, activeWorkout } = useWorkoutTimer()
</script>

<template>
  <div class="main-navigation">
    <TheButton
      v-if="activeWorkout"
      v-tooltip="{ content: 'Go to active workout', position: 'bottom' }"
      :link-path="localePath(`/workout/run/${activeWorkout.id}`)"
      variant="success"
    >
      <OdometerTimer :time="timer" />
    </TheButton>
    <TheButton :link-path="localePath('/workout')">
      {{ $t('workout.create_workout') }}
    </TheButton>
  </div>
</template>

<style src='./style.css' />

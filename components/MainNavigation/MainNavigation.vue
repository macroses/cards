<script setup lang="ts">
const localePath = useLocalePath()
const { timer, activeWorkout } = useWorkoutTimer()
</script>

<template>
  <nav
    class="main-navigation"
    :class="{ 'main-navigation--active-workout': activeWorkout }"
    aria-label="Main navigation"
  >
    <TheButton
      v-if="activeWorkout"
      v-tooltip="{ content: 'Go to active workout', position: 'bottom' }"
      :link-path="localePath(`/workout/run/${activeWorkout.id}`)"
      variant="success"
      aria-label="Go to active workout"
    >
      <OdometerTimer :time="timer" />
    </TheButton>
    <TheButton
      :link-path="localePath('/workout')"
      :aria-label="$t('workout.create_workout')"
    >
      {{ $t('workout.create_workout') }}
    </TheButton>
  </nav>
</template>

<style src='./style.css' />

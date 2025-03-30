<script setup lang="ts">
const localePath = useLocalePath()
const { timer, activeWorkout } = useWorkoutTimer()
</script>

<template>
  <div class="main-navigation">
    <TheButton
      v-if="activeWorkout"
      v-tooltip="{ content: 'Go to active workout', position: 'bottom' }"
      link
      :link-path="localePath(`/workout/run/${activeWorkout.id}`)"
      variant="success"
    >
      {{ timer }}
    </TheButton>
    <TheButton
      link
      :link-path="localePath('/workout')"
    >
      {{ $t('workout.create_workout') }}
    </TheButton>
  </div>
</template>

<style src='./style.css' />

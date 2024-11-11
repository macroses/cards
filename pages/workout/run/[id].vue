<script setup lang="ts">
const route = useRoute()
const workoutId = route.params.id as string
</script>

<template>
  <div>
    <p>Workout ID: {{ workoutId }}</p>
    <pre>{{ route.params }}</pre>
  </div>
</template>

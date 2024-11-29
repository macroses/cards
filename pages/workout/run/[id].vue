<script setup lang="ts">
const { runWorkout, initRunMode } = useRunWorkout()

onMounted(async () => await initRunMode())
</script>

<template>
  <div v-if="runWorkout">
    <h1>{{ runWorkout.title }}</h1>
    <ul>
      <li v-for="exercise in runWorkout.exercises" :key="exercise.id">
        {{ exercise.exerciseName }}
      </li>
    </ul>
  </div>
  <div v-else>
    Тренировка не найдена
  </div>
</template>

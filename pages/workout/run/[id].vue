<script setup lang="ts">
const { runWorkout, initRunMode } = useRunWorkout()
const { endWorkout } = useFinishWorkout()

async function handleEndWorkout() {
  if (runWorkout.value) {
    await endWorkout(runWorkout.value.id)
  }
}

onMounted(async () => await initRunMode())
</script>

<template>
  <div v-if="runWorkout">
    <button @click="handleEndWorkout">
      finish
    </button>
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

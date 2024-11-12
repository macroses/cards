<script setup lang="ts">
import type { ExerciseServerTemplate } from '~/ts/interfaces/ExerciseServerTemplate.interface'

defineProps<{
  exercise: ExerciseServerTemplate | null
}>()
</script>

<template>
  <div class="exercise-details">
    <h2>{{ exercise?.name }}</h2>
    <div
      v-if="exercise"
      class="exercise-info"
    >
      <p>{{ exercise.description }}</p>
      <div class="exercise-details">
        <p><strong>Основная мышечная группа:</strong> {{ exercise.muscles.primary }}</p>
        <p v-if="exercise.muscles.secondary?.length">
          <strong>Дополнительные мышцы:</strong> {{ exercise.muscles.secondary.join(', ') }}
        </p>
        <p><strong>Тип:</strong> {{ exercise.characteristics.type }}</p>
        <p><strong>Уровень:</strong> {{ exercise.characteristics.level }}</p>
      </div>
    </div>
  </div>
</template>

<!-- <style src='./style.css' /> -->

<script setup lang="ts">
import type { ExerciseTemplate } from '~/ts'

defineProps<{
  exercise: ExerciseTemplate | null
}>()
</script>

<template>
  <div class="exercise-details">
    <h2>{{ exercise?.name }}</h2>
    <div
      v-if="exercise"
      class="exercise-info"
    >
      <div class="exercise-details">
        <p><strong>Основная мышечная группа:</strong> {{ exercise.primary }}</p>
        <p v-if="exercise.secondary?.length">
          <strong>Дополнительные мышцы:</strong> {{ exercise.secondary.join(', ') }}
        </p>
        <p><strong>Тип:</strong> {{ exercise.category }}</p>
        <p><strong>Уровень:</strong> {{ exercise.level }}</p>
      </div>
    </div>
  </div>
</template>

<!-- <style src='./style.css' /> -->

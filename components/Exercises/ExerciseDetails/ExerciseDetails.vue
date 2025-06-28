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
      <div class="exercise-details__text">
        <p><strong>Основные:</strong> {{ exercise.primary }}</p>
        <p v-if="exercise.secondary?.length">
          <strong>Вспомогательные:</strong> {{ exercise.secondary.join(', ') }}
        </p>
        <p><strong>Тип:</strong> {{ exercise.category }}</p>
        <p><strong>Уровень:</strong> {{ exercise.level }}</p>
        <div class="exercise-details__link">
          <iframe
            width="560"
            height="200"
            :src="exercise?.link"
            title="YouTube video player"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<!-- <style src='./style.css' /> -->

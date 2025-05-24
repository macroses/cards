<script setup lang="ts">
import type { ExerciseServerTemplate } from '~/ts/interfaces'

defineProps<{
  exercises: ExerciseServerTemplate[]
}>()

defineEmits<{
  (e: 'removeExercise', id: string): void
}>()
</script>

<template>
  <div class="program__settings-exercises">
    <ul class="program__settings-exercise-list">
      <li
        v-for="exercise in exercises"
        :key="exercise.id"
        class="program__settings-exercise-item"
      >
        <div class="program__settings-exercise-name">
          {{ exercise.name }}
        </div>
        <TheButton
          variant="transparent"
          icon-only
          @click="$emit('removeExercise', exercise.id)"
        >
          <TheIcon
            icon-name="xmark"
            width="20"
          />
        </TheButton>
      </li>
    </ul>
  </div>
</template>

<style src="./style.css" />

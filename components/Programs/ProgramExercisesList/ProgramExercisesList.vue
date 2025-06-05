<script setup lang="ts">
import type { ExerciseTemplate } from '~/ts'

defineProps<{
  exercises: ExerciseTemplate[]
}>()

defineEmits<{
  (e: 'removeExercise', id: string): void
}>()

const { errors, defineField } = useForm()

const [maxPM] = defineField('maxPM')
</script>

<template>
  <div class="program__settings-exercises">
    <slot />

    <ul class="program__settings-exercise-list">
      <li
        v-for="exercise in exercises"
        :key="exercise.id"
        class="program__settings-exercise-item"
      >
        <div class="program__settings-exercise-name">
          {{ exercise.name }}
        </div>

        <TheInput
          v-model="maxPM"
          :error-message="errors.maxPM"
        />

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

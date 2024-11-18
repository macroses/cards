<script setup lang="ts">
import type { ExerciseServerTemplate, UserWorkoutExercise } from '~/ts/interfaces'

const emit = defineEmits<{
  selectExercise: [exercise: UserWorkoutExercise]
}>()

const { exercisesList } = useFetchExercisesList()

function selectExercise(exercise: ExerciseServerTemplate) {
  emit('selectExercise', {
    id: exercise.id,
    name: exercise.name,
  })
}
</script>

<template>
  <ul class="muscles-list">
    <li
      v-for="group in exercisesList"
      :key="group.primary"
      v-auto-animate
      class="muscle-item"
    >
      <button
        class="muscle-item__title"
      >
        <TheIcon
          icon-name="angle-down"
          width="14px"
          class="muscle-item__title-icon"
        />
        <span class="muscle-name">{{ group.primary }}</span>
        <span class="exercises-count">{{ group.exercises.length }}</span>
      </button>
      <ul
        class="exercises-list"
      >
        <ExerciseItem
          v-for="exercise in group.exercises"
          :key="exercise.id"
          :exercise
          :is-selected="false"
          @select="selectExercise"
        />
      </ul>
    </li>
  </ul>
</template>

<style src='./style.css' />

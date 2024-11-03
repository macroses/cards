<script setup lang="ts">
import type Exercise from '~/types/Exercise'

interface ExerciseGroup {
  primary: string
  exercises: Exercise[]
}

const props = defineProps<{
  selectedExercises: Exercise[]
}>()

const emit = defineEmits<{
  selectExercise: [exercise: Exercise]
}>()

const { data: exercises } = await useAsyncData<ExerciseGroup[]>(
  'exercises',
  () => $fetch('/api/exercises/exercises'),
)

const activeGroupId = ref<string | null>(null)

function toggleGroup(groupId: string) {
  activeGroupId.value = activeGroupId.value === groupId ? null : groupId
}

function isExerciseSelected(exercise: Exercise) {
  return props.selectedExercises.some(selected => selected.id === exercise.id)
}

function selectExercise(exercise: Exercise) {
  emit('selectExercise', exercise)
}
</script>

<template>
  <ul>
    <li
      v-for="group in exercises"
      :key="group.primary"
      v-auto-animate
      class="muscle-item"
      :class="{ active: activeGroupId === group.primary }"
    >
      <button
        @click="toggleGroup(group.primary)"
      >
        {{ group.primary }} {{ group.exercises.length }}
      </button>
      <ul
        v-if="activeGroupId === group.primary"
        class="exercises-list"
      >
        <li
          v-for="exercise in group.exercises"
          :key="exercise.id"
          class="exercise-item"
          :class="{ added: isExerciseSelected(exercise) }"
          @click="selectExercise(exercise)"
        >
          {{ exercise.name }}
        </li>
      </ul>
    </li>
  </ul>
</template>

<style src='./style.css' />

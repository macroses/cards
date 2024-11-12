<script setup lang="ts">
import TheModal from '~/components/ui/TheModal/TheModal.vue'
import type { ExerciseServerTemplate } from '~/ts/interfaces'

const props = defineProps<{
  selectedExercises: ExerciseServerTemplate[]
}>()

const emit = defineEmits<{
  selectExercise: [exercise: ExerciseServerTemplate]
}>()

const {
  exercisesList,
  activeGroupId,
  modalRef,
  selectedExerciseForModal,
  toggleGroup,
  isExerciseSelected,
  openModal,
  closeModal,
} = useExercisesList({ selectedExercises: props.selectedExercises, emit })

function selectExercise(exercise: ExerciseServerTemplate) {
  emit('selectExercise', exercise)
}
</script>

<template>
  <ul class="muscles-list">
    <li
      v-for="group in exercisesList"
      :key="group.primary"
      v-auto-animate
      class="muscle-item"
      :class="{ active: activeGroupId === group.primary }"
    >
      <button
        class="muscle-item__title"
        @click="toggleGroup(group.primary)"
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
        v-if="activeGroupId === group.primary"
        class="exercises-list"
      >
        <ExerciseItem
          v-for="exercise in group.exercises"
          :key="exercise.id"
          :exercise="exercise"
          :is-selected="isExerciseSelected(exercise)"
          @select="selectExercise"
          @open-modal="openModal"
        />
      </ul>
    </li>
  </ul>
  <Teleport to="body">
    <TheModal
      ref="modalRef"
      bottom-modal
    >
      <template #content>
        <ExerciseDetails :exercise="selectedExerciseForModal" />
        <TheButton
          v-if="!isExerciseSelected(selectedExerciseForModal!)"
          @click="closeModal"
        >
          Добавить упражнение
        </TheButton>
      </template>
    </TheModal>
  </Teleport>
</template>

<style src='./style.css' />

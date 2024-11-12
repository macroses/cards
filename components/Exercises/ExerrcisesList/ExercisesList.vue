<script setup lang="ts">
import TheModal from '~/components/ui/TheModal/TheModal.vue'
import { useGetExercisesList } from '~/composables/exerciseManagment/useGetExercisesList'
import type { ExerciseServerTemplate } from '~/ts/interfaces/ExerciseServerTemplate.interface'

const props = defineProps<{
  selectedExercises: ExerciseServerTemplate[]
}>()

const emit = defineEmits<{
  selectExercise: [exercise: ExerciseServerTemplate]
}>()

const { exercisesList } = useGetExercisesList()

const activeGroupId = ref<string | null>(null)

function toggleGroup(groupId: string) {
  activeGroupId.value = activeGroupId.value === groupId ? null : groupId
}

function isExerciseSelected(exercise: ExerciseServerTemplate) {
  return props.selectedExercises.some(selected => selected.id === exercise.id)
}

function selectExercise(exercise: ExerciseServerTemplate) {
  emit('selectExercise', exercise)
}

const modalRef = ref<InstanceType<typeof TheModal> | null>(null)

const selectedExerciseForModal = ref<ExerciseServerTemplate | null>(null)

function openModal(exercise: ExerciseServerTemplate) {
  selectedExerciseForModal.value = exercise
  modalRef.value?.openModal()
}

function closeModal() {
  if (selectedExerciseForModal.value) {
    emit('selectExercise', selectedExerciseForModal.value)
  }

  selectedExerciseForModal.value = null
  modalRef.value?.closeModal()
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

<script setup lang="ts">
import TheModal from '~/components/ui/TheModal/TheModal.vue'
import { useGetExercisesList } from '~/composables/exerciseManagment/useGetExercisesList'
import type { Exercise } from '~/types/Exercise'

const props = defineProps<{
  selectedExercises: Exercise[]
}>()

const emit = defineEmits<{
  selectExercise: [exercise: Exercise]
}>()

const { exercisesList } = useGetExercisesList()

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

const modalRef = ref<InstanceType<typeof TheModal> | null>(null)

function openModal() {
  modalRef.value?.openModal()
}

function closeModal() {
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
        <li
          v-for="exercise in group.exercises"
          :key="exercise.id"
          class="exercise-item"
          :class="{ added: isExerciseSelected(exercise) }"
          @click="selectExercise(exercise)"
        >
          <p>
            {{ exercise.name }}
            <TheIcon
              v-if="isExerciseSelected(exercise)"
              icon-name="circle-check"
              width="16px"
            />
          </p>
          <TheIcon
            icon-name="angle-right"
            width="14px"
            @click="openModal"
          />
          <TheIcon
            icon-name="angle-right"
            width="14px"
          />
        </li>
      </ul>
    </li>
  </ul>
  <Teleport to="body">
    <TheModal ref="modalRef">
      <template #title>
        <h2>Заголовок модального окна</h2>
      </template>
      <template #content>
        <p>Содержимое модального окна</p>
      </template>
      <template #footer>
        <TheButton @click="closeModal">
          Закрыть
        </TheButton>
      </template>
    </TheModal>
  </Teleport>
</template>

<style src='./style.css' />

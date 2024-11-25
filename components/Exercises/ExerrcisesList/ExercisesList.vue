<script setup lang="ts">
import TheModal from '~/components/ui/TheModal/TheModal.vue'
import type { ExerciseServerTemplate, UserWorkoutExercise } from '~/ts/interfaces'

const props = defineProps<{
  selectedExercises: UserWorkoutExercise[]
}>()

const emit = defineEmits<{
  selectExercise: [exercise: UserWorkoutExercise]
}>()

const { exercisesList } = useFetchExercisesList()

const modalRef = ref <typeof TheModal | null>(null)
const selectedExerciseForModal = ref<ExerciseServerTemplate | null>(null)

function selectExercise(exercise: ExerciseServerTemplate) {
  emit('selectExercise', {
    id: exercise.id,
    name: exercise.name,
  })
}

function isExerciseAlreadySelected(id: number) {
  return props.selectedExercises.some(selected => selected.id === id)
}

const activeGroupId = ref<string | null>(null)

function toggleGroup(groupId: string) {
  activeGroupId.value = activeGroupId.value === groupId ? null : groupId
}

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

function isExerciseSelected(exerciseId: number) {
  return props.selectedExercises.some(selected => selected.id === exerciseId)
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
          :exercise
          :is-selected="isExerciseAlreadySelected(exercise.id)"
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
      class="body-modal"
    >
      <template #content>
        <div class="exercise-details__wrapper">
          <BodySvg
            body-part="Lats"
            :secondary-part="['Traps']"
          />
          <div class="exercise-details__description">
            <ExerciseDetails :exercise="selectedExerciseForModal" />
            <TheButton
              v-if="selectedExerciseForModal && !isExerciseSelected(selectedExerciseForModal.id)"
              @click="closeModal"
            >
              Добавить упражнение
            </TheButton>
          </div>
        </div>
      </template>
    </TheModal>
  </Teleport>
</template>

<style src='./style.css' />

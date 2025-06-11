<script setup lang="ts">
import type { ExerciseTemplate, WorkoutExercise } from '~/ts'
import TheModal from '~/components/ui/TheModal/TheModal.vue'

interface ExercisesGroup {
  primary: string
  exercises: ExerciseTemplate[]
}

const props = defineProps<{
  selectedExercises: WorkoutExercise[]
  exercisesList: ExerciseTemplate[]
}>()

const emit = defineEmits<{
  selectExercise: [exercise: WorkoutExercise]
  removeExercise: [exerciseId: string]
}>()

const modalRef = useTemplateRef<typeof TheModal>('modalRef')
const selectedExerciseForModal = shallowRef<ExerciseTemplate | null>(null)

const groupedExercises = computed<ExercisesGroup[]>(() => {
  const grouped = props.exercisesList.reduce((acc, exercise) => {
    const primary = exercise.primary
    if (!acc[primary]) {
      acc[primary] = {
        primary,
        exercises: [],
      }
    }

    acc[primary].exercises.push(exercise)

    return acc
  }, {} as Record<string, ExercisesGroup>)

  return Object.values(grouped)
})

function selectExercise(exercise: ExerciseTemplate) {
  emit('selectExercise', {
    id: exercise.id,
    name: exercise.name,
  })
}

function isExerciseAlreadySelected(id: string) {
  return props.selectedExercises.some(selected => selected.id === id)
}

const activeGroupId = shallowRef<string | null>(null)

function toggleGroup(groupId: string) {
  activeGroupId.value = activeGroupId.value === groupId ? null : groupId
}

function openModal(exercise: ExerciseTemplate) {
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

function isExerciseSelected(exerciseId: string) {
  return props.selectedExercises.some(selected => selected.id === exerciseId)
}
</script>

<template>
  <ul class="muscles-list__list">
    <li
      v-for="group in groupedExercises"
      :key="group.primary"
      v-auto-animate="{ duration: 250 }"
      class="muscle-item"
      :class="{ active: activeGroupId === group.primary }"
    >
      <button
        class="muscle-item__title"
        @click="toggleGroup(group.primary)"
      >
        <TheIcon
          icon-name="angle-down"
          width="14"
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
      class="body-modal"
    >
      <template #content>
        <div class="exercise-details__wrapper">
          <BodySvg
            :body-part="selectedExerciseForModal?.primary"
            :secondary-part="selectedExerciseForModal?.secondary"
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

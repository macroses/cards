<script setup lang="ts">
import type CreateExerciseModal from './CreateExerciseModal/CreateExerciseModal.vue'
import type { ExerciseServerTemplate, UserWorkoutExercise } from '~/ts/interfaces'
import TheModal from '~/components/ui/TheModal/TheModal.vue'

const props = defineProps<{
  exercisesList: ExerciseServerTemplate[]
  selectedExercises: UserWorkoutExercise[]
}>()

const emit = defineEmits<{
  selectExercise: [exercise: UserWorkoutExercise]
  openModal: [exercise: ExerciseServerTemplate]
  removeExercise: [exerciseId: string]
}>()

const {
  exercises,
  isLoading,
  error,
  deleteExercise,
  createExercise,
} = useExerciseHandle()

const createExerciseModalRef = ref<InstanceType<typeof CreateExerciseModal> | null>(null)
const confirmModalRef = ref<typeof TheModal | null>(null)
const exerciseToDeleteId = ref('')

function handleOpenModal() {
  createExerciseModalRef.value?.openModal()
}

async function handleCreateExercise(exercise: Omit<ExerciseServerTemplate, 'id'>) {
  await createExercise(exercise)
}

function selectExercise(exercise: ExerciseServerTemplate) {
  emit('selectExercise', {
    id: exercise.id,
    name: exercise.name,
  })
}

function isExerciseSelected(exerciseId: string) {
  return props.selectedExercises.some(selected => selected.id === exerciseId)
}

async function handleDelete(event: Event, exerciseId: string) {
  event.stopPropagation()
  exerciseToDeleteId.value = exerciseId
  confirmModalRef.value?.openModal()
}

async function confirmDelete(exerciseId: string) {
  if (isExerciseSelected(exerciseId)) {
    emit('removeExercise', exerciseId)
  }

  confirmModalRef.value?.closeModal()
  await deleteExercise(exerciseId)
}
</script>

<template>
  <div class="my_exercises">
    <TheLoader v-if="isLoading" />
    <p v-else-if="error">
      {{ error }}
    </p>
    <ul
      v-else
      class="my_exercises__list"
    >
      <li
        v-for="exercise in exercises"
        :key="exercise.id"
        class="my_exercises__list-item"
        :class="{ selected: isExerciseSelected(exercise.id) }"
        @click="selectExercise(exercise)"
      >
        {{ exercise.name }}
        <div class="my_exercises__list-item-actions">
          <TheButton
            variant="transparent"
            class="my_exercises__list-item--delete"
            @click="handleDelete($event, exercise.id)"
          >
            <TheIcon
              icon-name="trash-can"
              width="18px"
            />
          </TheButton>
        </div>
      </li>
    </ul>
    <TheButton @click="handleOpenModal">
      + Добавить
    </TheButton>

    <CreateExerciseModal
      ref="createExerciseModalRef"
      :exercises-list="exercisesList"
      @submit="handleCreateExercise"
    />

    <TheModal
      ref="confirmModalRef"
      :has-close-button="false"
      class="remove-exercise-modal"
    >
      <template #content>
        <div class="remove-exercise-modal__content">
          <div class="remove-exercise-modal__content-text">
            <!--     todo: попробовать реализовать восстановление упражнения по введению id удаленого упражнения       -->
            <p>Подтвердите <span>удаление</span> упражнения</p><br>
          </div>
        </div>
      </template>
      <template #footer>
        <div class="remove-exercise-modal__footer">
          <TheButton
            variant="ghost"
          >
            отменить
          </TheButton>
          <TheButton
            variant="danger"
            @click="confirmDelete(exerciseToDeleteId)"
          >
            удалить
          </TheButton>
        </div>
      </template>
    </TheModal>
  </div>
</template>

<style src="./style.css" />

<script  lang="ts" setup="">
import type TheModal from '~/components/ui/TheModal/TheModal.vue'
import type { WorkoutResponse } from '~/ts'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'

const props = defineProps<{
  selectedWorkout: WorkoutResponse
}>()

defineEmits<{
  (e: 'update:selectedExerciseId', id: string): void
}>()

dayjs.extend(duration)

const selectedExerciseId = shallowRef<string | null>(null)
const modalRef = useTemplateRef<typeof TheModal>('modalRef')
const isMobileChartsVisible = shallowRef(false)
const isMobile = useMediaQuery('(max-width: 768px)')

function openModal() {
  modalRef.value?.openModal()

  if (props.selectedWorkout?.exercises.length) {
    selectedExerciseId.value = props.selectedWorkout.exercises[0].exerciseId
  }
}

function closeModal() {
  modalRef.value?.closeModal()
}

defineExpose({
  openModal,
  closeModal,
})
</script>

<template>
  <TheModal
    ref="modalRef"
    :has-close-button="false"
    class="workout-results__modal"
  >
    <template #header>
      <div class="workout-results__header">
        <TheButton
          v-if="isMobile && isMobileChartsVisible"
          icon-only
          class="workout-results__back-button"
          @click="isMobileChartsVisible = false"
        >
          <TheIcon
            icon-name="angle-left"
            width="20"
          />
        </TheButton>
        <h3>
          {{ selectedWorkout.title }}
          <span>{{ dayjs(selectedWorkout.workoutDate).format('DD.MM.YYYY') }}</span>
        </h3>
      </div>
    </template>
    <template #content>
      <FinishedWorkoutResult
        v-if="selectedWorkout"
        v-model:is-charts-visible="isMobileChartsVisible"
        :selected-workout="selectedWorkout"
        :selected-exercise-id="selectedExerciseId"
        @update:selected-exercise-id="selectedExerciseId = $event"
      />
    </template>
  </theModal>
</template>

<style scoped>
.workout-results__header {
  position: relative;
}

h3 {
  margin-bottom: 12px;
}

.workout-results__back-button {
  position: absolute;
  right: 0;
  top: -4px;
  z-index: 10;
}
</style>

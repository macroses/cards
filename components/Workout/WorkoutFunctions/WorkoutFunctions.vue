<script setup lang="ts">
import type { WorkoutFunctionsProps } from '~/ts/componentProps'
import TheModal from '~/components/ui/TheModal/TheModal.vue'

const props = withDefaults(defineProps<WorkoutFunctionsProps>(), {
  isCopyMode: false,
  isWorkoutActive: false,
})

const emit = defineEmits<{
  (event: 'deleteWorkout'): void
  (event: 'copyWorkout'): void
  (event: 'updateWorkout'): void
  (event: 'openResults'): void
}>()

const localePath = useLocalePath()
const runWorkoutConfirm = ref<typeof TheModal | null>(null)

const { startWorkout } = useStartWorkout()
const { activeWorkout } = useWorkoutTimer()

const showStartButton = computed(() => {
  if (props.isWorkoutCompleted) {
    return false
  }

  return !activeWorkout.value || props.isWorkoutActive
})

function openRunWorkoutConfirm() {
  if (props.isWorkoutActive) {
    navigateTo(localePath(`/workout/run/${props.workoutId}`))
    return
  }

  runWorkoutConfirm.value?.openModal()
}
async function handleStartWorkout() {
  await startWorkout(props.workoutId)
  navigateTo(localePath(`/workout/run/${props.workoutId}`))
}

function closeRunWorkoutConfirm() {
  runWorkoutConfirm.value?.closeModal()
}
</script>

<template>
  <div
    class="date-menu"
    :class="{ 'date-menu__completed': isWorkoutCompleted }"
  >
    <div class="date-menu__event-name">
      {{ workoutTitle }}
    </div>

    <ul class="date-menu__functions">
      <li v-if="isWorkoutCompleted">
        <TheButton
          variant="secondary"
          @click="$emit('openResults')"
        >
          Results
        </TheButton>
      </li>
      <li v-else-if="showStartButton">
        <TheButton
          :variant="isWorkoutActive ? 'warning' : 'success'"
          @click="openRunWorkoutConfirm"
        >
          {{ isWorkoutActive ? 'Go on' : 'Start' }}
        </TheButton>
      </li>
      <li class="date-menu__functions-item">
        <TheButton
          v-tooltip="$t('main_navigation.copy_workout')"
          variant="ghost"
          icon-only
          @click.stop="emit('copyWorkout')"
        >
          <TheIcon
            icon-name="copy"
            width="18px"
          />
        </TheButton>
      </li>
      <li
        v-if="!isWorkoutCompleted && !isWorkoutActive"
        class="date-menu__functions-item"
      >
        <TheButton
          v-tooltip="$t('main_navigation.edit_workout')"
          variant="ghost"
          icon-only
          @click="emit('updateWorkout')"
        >
          <TheIcon
            icon-name="pen-to-square"
            width="18px"
          />
        </TheButton>
      </li>
      <li class="date-menu__functions-item">
        <TheButton
          v-tooltip="$t('main_navigation.delete_workout')"
          variant="ghost"
          icon-only
          @click.stop="emit('deleteWorkout')"
        >
          <TheIcon
            icon-name="trash-can"
            width="18px"
          />
        </TheButton>
      </li>
      <li class="date-menu__functions-item">
        <TheButton
          v-tooltip="$t('main_navigation.delete_workout')"
          variant="ghost"
          icon-only
        >
          <TheIcon
            icon-name="sliders"
            width="18px"
          />
        </TheButton>
      </li>
    </ul>

    <TheModal
      ref="runWorkoutConfirm"
      :is-outside-close="false"
      :has-close-button="false"
      class="date-menu__start-workout"
    >
      <template #content>
        <div class="date-menu__start-content">
          <div class="date-menu__start-text">
            <p>Вы приступите к выполнению тренировки.</p>
            <p>Это следует делать, <b>если вы готовы начать прямо сейчас</b></p>
          </div>
        </div>
      </template>
      <template #footer>
        <div class="date-menu__start-footer">
          <TheButton
            variant="ghost"
            @click="closeRunWorkoutConfirm"
          >
            отменить
          </TheButton>
          <TheButton
            @click="handleStartWorkout"
          >
            начать
          </TheButton>
        </div>
      </template>
    </TheModal>
  </div>
</template>

<style src="./style.css" />

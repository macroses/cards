<script setup lang="ts">
import TheModal from '~/components/ui/TheModal/TheModal.vue'
import type { WorkoutFunctionsProps } from '~/ts/componentProps'

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

const { t } = useI18n()
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
  <div class="date-menu">
    <div class="date-menu__event-name">
      <TheIcon
        v-if="isWorkoutCompleted"
        v-tooltip="t('toast.workout_completed')"
        icon-name="circle-check"
        width="18px"
        @click="$emit('openResults')"
      />
      {{ workoutTitle }}
    </div>

    <ul
      class="date-menu__functions"
    >
      <li class="date-menu__functions-item">
        <TheButton
          v-tooltip="t('main_navigation.copy_workout')"
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
          v-tooltip="t('main_navigation.edit_workout')"
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
          v-tooltip="t('main_navigation.delete_workout')"
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
    </ul>

    <div
      v-if="showStartButton"
      class="start-workout__wr"
    >
      <button
        class="start-workout__button"
        :class="{ activeWorkout: isWorkoutActive }"
        @click="openRunWorkoutConfirm"
      >
        {{ isWorkoutActive ? 'Go on' : 'Start' }}
      </button>
      <div class="first-ring" />
      <div class="second-ring" />
    </div>

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

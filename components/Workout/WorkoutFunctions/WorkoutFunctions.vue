<script setup lang="ts">
import TheModal from '~/components/ui/TheModal/TheModal.vue'
import type { WorkoutFunctionsProps } from '~/ts/componentProps'

withDefaults(defineProps<WorkoutFunctionsProps>(), {
  isCopyMode: false,
})

const emit = defineEmits<{
  (event: 'deleteWorkout'): void
  (event: 'copyWorkout'): void
  (event: 'updateWorkout'): void
}>()

const { t } = useI18n()
const localePath = useLocalePath()
const runWorkoutConfirm = ref<typeof TheModal | null>(null)

function openRunWorkoutConfirm() {
  runWorkoutConfirm.value?.openModal()
}

function closeRunWorkoutConfirm() {
  runWorkoutConfirm.value?.closeModal()
}
</script>

<template>
  <div class="date-menu">
    <div class="date-menu__event-name">
      {{ workoutTitle }}
    </div>

    <ul class="date-menu__functions">
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
        v-if="!isWorkoutCompleted"
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

    <div class="start-workout__wr">
      <button
        class="start-workout__button"
        @click="openRunWorkoutConfirm"
      >
        Start
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
        <TheIcon
          icon-name="lightbulb"
          width="20px"
        />
        <p>Вы приступите к выполнению тренировки.</p>
        <p>Это следует делать, <b>если вы готовы начать прямо сейчас</b></p>
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
            link
            :link-path="localePath(`/workout/run/${workoutId}`)"
          >
            начать
          </TheButton>
        </div>
      </template>
    </TheModal>
  </div>
</template>

<style src="./style.css" />

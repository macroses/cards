<script setup lang="ts">
import RunWorkoutModal from '~/components/RunWorkoutModal/RunWorkoutModal.vue'
import TheModal from '~/components/ui/TheModal/TheModal.vue'

interface WorkoutFunctionsProps {
  workoutId: string
  workoutTitle: string
  isWorkoutCompleted?: boolean
  isCopyMode?: boolean
  isWorkoutActive?: boolean
}

const props = withDefaults(defineProps<WorkoutFunctionsProps>(), {
  isCopyMode: false,
  isWorkoutActive: false,
})

defineEmits<{
  (event: 'deleteWorkout'): void
  (event: 'copyWorkout'): void
  (event: 'updateWorkout'): void
}>()

const { t } = useI18n()
const localePath = useLocalePath()
const runWorkoutConfirm = ref<InstanceType<typeof RunWorkoutModal> | null>(null)
const readWorkoutResults = ref<InstanceType<typeof TheModal> | null>(null)
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

function showResultModal() {
  readWorkoutResults.value?.openModal()
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
        @click="showResultModal"
      />
      {{ workoutTitle }}
    </div>

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

    <RunWorkoutModal
      ref="runWorkoutConfirm"
      @start-workout="handleStartWorkout"
    />

    <TheModal
      ref="readWorkoutResults"
    >
      <template #content>
        fsdfsdfs
      </template>
    </TheModal>
  </div>
</template>

<style src="./style.css" />

<script setup lang="ts">
definePageMeta({ auth: true })

const { toast } = useToastState()

function debugToast() {
  toast('Test message for toast, Test message for toast, Test message for toast')
}

const {
  selectedWorkout,
  selectedDate,
  workouts,
} = useSelectedWorkout()

const {
  deleteWorkout,
  copyWorkout,
  updateWorkoutDate,
  startCopyMode,
  cancelCopyMode,
  startDateChangeMode,
  cancelDateChangeMode,
  isCopyMode,
  isDateChangeMode,
  workoutToCopy,
  workoutToChangeDate,
} = useWorkout()

const { fetchWorkouts } = useGetWorkouts()

async function handleDeleteWorkout() {
  if (!selectedWorkout.value?.id) {
    return
  }

  const success = await deleteWorkout(selectedWorkout.value.id)

  if (success) {
    await fetchWorkouts()
  }
}

function handleCopyWorkout() {
  if (!selectedWorkout.value)
    return

  if (isCopyMode.value) {
    cancelCopyMode()

    return
  }

  startCopyMode(selectedWorkout.value)
}

function handleChangeDateMode() {
  if (!selectedWorkout.value)
    return

  if (isDateChangeMode.value) {
    cancelDateChangeMode()
    return
  }

  startDateChangeMode(selectedWorkout.value)
}

async function handleDateSelect(date: Date) {
  if (isCopyMode.value && workoutToCopy.value) {
    const success = await copyWorkout(workoutToCopy.value, date)

    if (success) {
      await fetchWorkouts()
      cancelCopyMode()
    }
  }
  else if (isDateChangeMode.value && workoutToChangeDate.value) {
    const success = await updateWorkoutDate(workoutToChangeDate.value.id, date)

    if (success) {
      await fetchWorkouts()
      cancelDateChangeMode()
    }
  }
}

useSeoMeta({
  title: 'Home',
})
</script>

<template>
  <div class="home-page__container">
    <div class="home-page__calendar">
      <TheLoader v-if="!workouts" />
      <Calendar
        v-model="selectedDate"
        :workouts="workouts"
        :copy-mode="isCopyMode"
        :date-change-mode="isDateChangeMode"
        @date-select="handleDateSelect"
      />
      <MainNavigation />
      <WorkoutFunctions
        v-if="selectedWorkout"
        :workout="selectedWorkout"
        :is-copy-mode="isCopyMode"
        :is-date-change-mode="isDateChangeMode"
        @delete-workout="handleDeleteWorkout"
        @copy-workout="handleCopyWorkout"
        @change-date-mode="handleChangeDateMode"
      />
      <TheButton @click="debugToast">
        toast
      </TheButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import dayjs from 'dayjs'
import { GLOBAL_DATE, GLOBAL_WORKOUTS } from '~/constants'
import type { CreateWorkoutResponse } from '~/ts/interfaces'

definePageMeta({ auth: true })

const selectedDate = useState<Date>(GLOBAL_DATE, () => new Date())
const workouts = useState<CreateWorkoutResponse[] | null>(GLOBAL_WORKOUTS, () => null)
const isCopyMode = ref(false)
const workoutToCopy = ref<string | null>(null)

const localePath = useLocalePath()
const { deleteWorkout } = useDeleteWorkout()
const { copyWorkout } = useCopyWorkout()

const selectedWorkout = computed(() => {
  return workouts.value?.find((workout: CreateWorkoutResponse) => {
    return dayjs(workout.workoutDate).isSame(selectedDate.value, 'day')
  })
})

const isWorkoutActive = computed(() => {
  return Boolean(selectedWorkout.value?.startedAt && !selectedWorkout.value.endedAt)
})

function toEditPage(): void {
  navigateTo(localePath(`/workout/?edit=${selectedWorkout.value?.id}`))
}

async function handleCopyWorkout(): Promise<void> {
  isCopyMode.value = true
  workoutToCopy.value = selectedWorkout.value?.id || null
}

async function handleDateSelect(date: Date) {
  if (isCopyMode.value && workoutToCopy.value) {
    await copyWorkout(workoutToCopy.value, date)
    isCopyMode.value = false
    workoutToCopy.value = null
  }
}

function handleDeleteWorkout(id: string) {
  isCopyMode.value = false
  deleteWorkout(id)
}
</script>

<template>
  <div class="home-page__container">
    <div class="home-page__calendar">
      <div v-auto-animate class="calendar-wrap">
        <Calendar
          v-model="selectedDate"
          :workouts="workouts"
          :copy-mode="isCopyMode"
          @date-select="handleDateSelect"
        />
        <MainNavigation />
        <LazyWorkoutFunctions
          v-if="selectedWorkout"
          :workout-title="selectedWorkout.title"
          :workout-id="selectedWorkout.id"
          :is-workout-completed="selectedWorkout.completed"
          :is-copy-mode="isCopyMode"
          :is-workout-active="isWorkoutActive"
          :inert="isCopyMode"
          :class="{ copyWorkout: isCopyMode }"
          @update-workout="toEditPage"
          @delete-workout="handleDeleteWorkout(selectedWorkout.id)"
          @copy-workout="handleCopyWorkout"
        />
      </div>
    </div>

    <Transition>
      <div
        v-if="isCopyMode"
        v-auto-animate
        class="copy-mode__popup"
      >
        Выберите дату для копирования
        <TheButton
          variant="secondary"
          icon-only
          @click="isCopyMode = false"
        >
          <TheIcon
            icon-name="xmark"
            width="20px"
          />
        </TheButton>
      </div>
    </Transition>
  </div>
</template>

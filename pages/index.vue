<script setup lang="ts">
import dayjs from 'dayjs'
import { GLOBAL_DATE, GLOBAL_WORKOUTS } from '~/constants'
import type { CreateWorkoutResponse } from '~/ts/interfaces'

definePageMeta({ auth: true })

const localePath = useLocalePath()
const selectedDate = useState<Date>(GLOBAL_DATE, () => new Date())
const workouts = useState<CreateWorkoutResponse[] | null>(GLOBAL_WORKOUTS, () => null)

const selectedWorkout = computed(() => {
  return workouts.value?.find((workout: CreateWorkoutResponse) => {
    return dayjs(workout.workoutDate).isSame(selectedDate.value, 'day')
  })
})

function handleDateSelect(date: Date) {
  selectedDate.value = date
}

function toEditPage() {
  navigateTo(localePath(`/workout/?edit=${selectedWorkout.value?.id}`))
}
</script>

<template>
  <div class="home-page__container">
    <div class="home-page__calendar">
      <Calendar
        v-model="selectedDate"
        :workouts
        @date-select="handleDateSelect"
      />
      <MainNavigation />
      <WorkoutFunctions
        v-if="selectedWorkout"
        :workout-title="selectedWorkout.title"
        :is-copy-mode="false"
        :is-date-change-mode="false"
        @update-workout="toEditPage"
      />
    </div>
  </div>
</template>

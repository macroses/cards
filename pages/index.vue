<script setup lang="ts">
import type { GetWorkoutsResponse } from '~/types/GetWorkoutsResponse'

definePageMeta({ auth: true })

const selectedDate = useState<Date>('selectedWorkoutDate', () => new Date())
const workouts = useState<GetWorkoutsResponse[] | null>('globalWorkouts', () => null)

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
      />
      <MainNavigation />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useGetWorkouts } from '~/composables/workout/useGetWorkouts'

definePageMeta({ auth: true })

const selectedDate = useState<Date>('selectedWorkoutDate', () => new Date())
const { workouts, status } = useGetWorkouts()

useSeoMeta({
  title: 'Home',
})
</script>

<template>
  <div class="home-page__container">
    <div class="home-page__calendar">
      <p v-if="status === 'pending'">
        Loading...
      </p>
      <Calendar
        v-model="selectedDate"
        :workouts="workouts"
      />
      <MainNavigation />
    </div>
  </div>
</template>

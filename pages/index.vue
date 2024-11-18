<script setup lang="ts">
import { GLOBAL_DATE, GLOBAL_WORKOUTS } from '~/constants'
import type { CreateWorkoutResponse } from '~/ts/interfaces'

definePageMeta({ auth: true })

const selectedDate = useState<Date>(GLOBAL_DATE, () => new Date())
const workouts = useState<CreateWorkoutResponse[] | null>(GLOBAL_WORKOUTS, () => null)

function handleDateSelect(date: Date) {
  selectedDate.value = date
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
    </div>
  </div>
</template>

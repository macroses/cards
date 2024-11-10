<script setup lang="ts">
import { useSelectedWorkout } from '~/composables/workout/useSelectedWorkout'

definePageMeta({ auth: true })

const {
  selectedWorkout,
  selectedDate,
  workouts,
} = useSelectedWorkout()

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

      <div v-if="selectedWorkout" class="date-menu">
        <p class="date-menu__event-name">
          {{ selectedWorkout?.title }}
        </p>
        <TheButton>Удалить</TheButton>
        <TheButton>Изменить</TheButton>
        <TheButton>Копировать</TheButton>
        <TheButton>Поменять дату</TheButton>
      </div>
    </div>
  </div>
</template>

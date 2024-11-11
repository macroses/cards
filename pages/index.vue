<script setup lang="ts">
import { useGetWorkouts } from '~/composables/workout/useGetWorkouts'
import { useSelectedWorkout } from '~/composables/workout/useSelectedWorkout'
import { useWorkout } from '~/composables/workout/useWorkout'

definePageMeta({ auth: true })

const {
  selectedWorkout,
  selectedDate,
  workouts,
} = useSelectedWorkout()

const { deleteWorkout } = useWorkout()
const { fetchWorkouts } = useGetWorkouts()
const { locale } = useI18n()

async function handleDeleteWorkout() {
  if (!selectedWorkout.value?.id)
    return

  const success = await deleteWorkout(selectedWorkout.value.id)
  if (success) {
    await fetchWorkouts()
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
      />
      <MainNavigation />

      <div v-if="selectedWorkout" class="date-menu">
        <p class="date-menu__event-name">
          {{ selectedWorkout?.title }}
        </p>
        {{ locale }}
        <NuxtLink :to="`${locale}/workout/run/${selectedWorkout.id}`">
          Перейти в тренировку
        </NuxtLink>
        <TheButton @click="handleDeleteWorkout">
          Удалить
        </TheButton>
        <TheButton>Изменить</TheButton>
        <TheButton>Копировать</TheButton>
        <TheButton>Поменять дату</TheButton>
      </div>
    </div>
  </div>
</template>

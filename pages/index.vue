<script setup lang="ts">
import { useGetWorkouts } from '~/composables/workout/useGetWorkouts'
import { useSelectedWorkout } from '~/composables/workout/useSelectedWorkout'
import { useWorkout } from '~/composables/workout/useWorkout'
import type { GetWorkoutsResponse } from '~/types/GetWorkoutsResponse'

definePageMeta({ auth: true })

const { locale } = useI18n()

const {
  selectedWorkout,
  selectedDate,
  workouts,
} = useSelectedWorkout()

const { deleteWorkout, copyWorkout } = useWorkout()
const { fetchWorkouts } = useGetWorkouts()

const isCopyMode = ref(false)
const workoutToCopy = ref<GetWorkoutsResponse | null>(null)

async function handleDeleteWorkout() {
  if (!selectedWorkout.value?.id)
    return

  const success = await deleteWorkout(selectedWorkout.value.id)
  if (success) {
    await fetchWorkouts()
  }
}

function handleCopyWorkout() {
  if (!selectedWorkout.value)
    return

  isCopyMode.value = true
  workoutToCopy.value = selectedWorkout.value
}

async function handleDateSelect(date: Date) {
  if (isCopyMode.value && workoutToCopy.value) {
    const success = await copyWorkout(workoutToCopy.value, date)

    if (success) {
      await fetchWorkouts()
      isCopyMode.value = false
      workoutToCopy.value = null
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
        @date-select="handleDateSelect"
      />
      <MainNavigation />

      <div v-if="selectedWorkout" class="date-menu">
        <p class="date-menu__event-name">
          {{ selectedWorkout?.title }}
        </p>
        <NuxtLink :to="`${locale}/workout/run/${selectedWorkout.id}`">
          Перейти в тренировку
        </NuxtLink>
        <TheButton @click="handleDeleteWorkout">
          Удалить
        </TheButton>
        <TheButton @click="handleCopyWorkout">
          {{ isCopyMode ? 'Отменить копирование' : 'Копировать' }}
        </TheButton>
        <TheButton>Изменить</TheButton>
        <TheButton>Поменять дату</TheButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useGetWorkouts } from '~/composables/workout/useGetWorkouts'

const { workouts } = useGetWorkouts()

const globalWorkouts = useState('globalWorkouts', () => workouts)

watch(workouts, newWorkouts => globalWorkouts.value = newWorkouts)
</script>

<template>
  <NuxtRouteAnnouncer />
  <NuxtLoadingIndicator />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  <TheToaster />
</template>

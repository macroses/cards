<script setup lang="ts">
import { useGetWorkouts } from '~/composables/workout/useGetWorkouts'

const { fetchWorkouts } = useGetWorkouts()

onMounted(async () => await fetchWorkouts())
</script>

<template>
  <NuxtRouteAnnouncer />
  <NuxtLoadingIndicator />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  <TheToaster />
</template>

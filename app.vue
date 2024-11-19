<script setup lang="ts">
const { fetchWorkouts } = useFetchWorkoutsByUserId()

onMounted(() => fetchWorkouts())
</script>

<template>
  <NuxtRouteAnnouncer />
  <NuxtLoadingIndicator />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  <TheToaster />
</template>

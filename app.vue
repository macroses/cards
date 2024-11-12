<script setup lang="ts">
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

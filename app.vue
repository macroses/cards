<script setup lang="ts">
const { fetchWorkouts } = useFetchWorkoutsByUserId()

const { status } = useAuth()

watch(status, (newStatus) => {
  if (newStatus === 'authenticated') {
    fetchWorkouts()
  }
})

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

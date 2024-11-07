<script setup lang="ts">
definePageMeta({ auth: true })

const selectedDate = useState<Date>('selectedWorkoutDate', () => new Date())

useSeoMeta({
  title: 'Home',
})
</script>

<template>
  <div class="home-page__container">
    <div class="home-page__calendar">
      <Calendar v-model="selectedDate" />
      <MainNavigation />
    </div>
  </div>
</template>

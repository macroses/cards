<script setup lang="ts">
definePageMeta({ auth: true })

const selectedDate = useState('selectedWorkoutDate', () => new Date())

function handleDateSelect(date: Date) {
  selectedDate.value = date
}

useSeoMeta({
  title: 'Home',
})
</script>

<template>
  <div class="home-page__container">
    <div class="home-page__calendar">
      <Calendar
        v-model="selectedDate"
        @date-select="handleDateSelect"
      />
      <MainNavigation />
    </div>
  </div>
</template>

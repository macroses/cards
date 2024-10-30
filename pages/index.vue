<script setup lang="ts">
definePageMeta({ auth: true })

const selectedDate = ref(new Date())
const locale = ref('ru')

function disabledDates(date: Date) {
  return date < new Date()
}
</script>

<template>
  <div class="home-page__container">
    <div class="home-page__calendar">
      <Calendar
        v-model="selectedDate"
        :locale="locale"
        :first-day-of-week="1"
        :disabled="disabledDates"
      />
      <MainNavigation />
    </div>
  </div>
</template>

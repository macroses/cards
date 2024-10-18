<script setup lang="ts">
defineProps<{
  cardStats: {
    total: number
    due: number
    new: number
    learning: number
  }
}>()
</script>

<template>
  <div class="module-stats">
    <h3>Статистика модуля:</h3>
    <p>Всего карточек: {{ cardStats.total }}</p>
    <p>Готово к повторению: {{ cardStats.due }}</p>
    <p>Новых: {{ cardStats.new }}</p>
    <p>В процессе изучения: {{ cardStats.learning }}</p>
  </div>
</template>

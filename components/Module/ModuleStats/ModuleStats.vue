<script setup lang="ts">
defineProps<{
  cardStats: {
    total: number
    due: number
    new: number
    learning?: number
  }
}>()
</script>

<template>
  <div class="module-stats">
    <h2>Statistics:</h2>
    <ul class="module-stats__content">
      <li>
        <span>Total cards:</span>
        <span>{{ cardStats.total }}</span>
      </li>
      <li>
        <span>Due for review:</span>
        <span>{{ cardStats.due }}</span>
      </li>
      <li>
        <span>New cards:</span>
        <span>{{ cardStats.new }}</span>
      </li>
    </ul>
  </div>
</template>

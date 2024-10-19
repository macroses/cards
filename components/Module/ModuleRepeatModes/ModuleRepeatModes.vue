<script setup lang="ts">
defineEmits<{
  (event: 'cards'): void
  (event: 'memorization'): void
  (event: 'test'): void
  (event: 'match'): void
}>()
</script>

<template>
  <nav>
    <ul>
      <li @click="$emit('cards')">
        <TheIcon
          icon-name="cards-blank"
          width="32px"
        />
        <span>
          Cards
        </span>
      </li>
      <li @click="$emit('memorization')">
        <TheIcon
          icon-name="brain-circuit"
          width="32px"
        />
        <span>
          Memorization
        </span>
      </li>
      <li @click="$emit('test')">
        <TheIcon
          icon-name="ballot-check"
          width="32px"
        />
        <span>
          Test
        </span>
      </li>
      <li @click="$emit('match')">
        <TheIcon
          icon-name="copy"
          width="32px"
        />
        <span>
          Match
        </span>
      </li>
    </ul>
  </nav>
</template>

<style scoped src='./style.css' />

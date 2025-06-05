<script setup lang="ts">
withDefaults(defineProps<{
  tag?: string
}>(), {
  tag: 'div',
})
</script>

<template>
  <component :is="tag" class="container-ui">
    <slot />
  </component>
</template>

<style scoped src="./style.css" />

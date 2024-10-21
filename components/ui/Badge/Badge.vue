<script setup lang="ts">
const props = defineProps<{
  color?: string
}>()

const styleObject = reactive({
  color: `rgb(${props.color})`,
  backgroundColor: `rgba(${props.color}, 0.1)`,
  border: `1px solid rgba(${props.color}, 0.5)`,
})
</script>

<template>
  <div
    class="badge"
    :style="styleObject"
  >
    <slot />
  </div>
</template>

<style src='./style.css' />

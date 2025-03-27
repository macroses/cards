<script setup lang="ts">
const detailsRef = useTemplateRef<HTMLDetailsElement>('detailsRef')

function handleClickOutside(event: MouseEvent) {
  if (detailsRef.value && !detailsRef.value.contains(event.target as Node)) {
    detailsRef.value.open = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <details ref="detailsRef">
    <summary>
      <slot name="summary" />
    </summary>
    <div class="details-content">
      <slot name="details-content" />
    </div>
  </details>
</template>

<style scoped src='./style.css' />

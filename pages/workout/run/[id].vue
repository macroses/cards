<script setup lang="ts">
const route = useRoute()

console.log(route.params.id)
</script>

<template>
  <p>{{ route }}</p>
</template>

<!-- <style src='./style.css' /> -->

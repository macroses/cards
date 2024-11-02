<script setup lang="ts">
const localePath = useLocalePath()
</script>

<template>
  <div class="main-navigation">
    <TheButton
      link
      :link-path="localePath('/workout')"
    >
      Create workout
    </TheButton>
    <TheButton>Program</TheButton>
    <TheButton>Body parameters</TheButton>
  </div>
</template>

<style src='./style.css' />

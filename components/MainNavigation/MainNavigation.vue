<script setup lang="ts">
const localePath = useLocalePath()
</script>

<template>
  <div class="main-navigation">
    <TheButton
      link
      :link-path="localePath('/workout')"
    >
      {{ $t('workout.create_workout') }}
    </TheButton>
    <TheButton>
      {{ $t('main_navigation.program') }}
    </TheButton>
    <TheButton>
      {{ $t('main_navigation.body_parameters') }}
    </TheButton>
  </div>
</template>

<style src='./style.css' />

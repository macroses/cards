<script setup lang="ts">
const localePath = useLocalePath()
</script>

<template>
  <ul class="programs-list">
    <li class="programs-list__item">
      <NuxtLink :to="localePath('/programs/linear')">
        линейная (Linear)
      </NuxtLink>
    </li>
    <li class="programs-list__item">
      <NuxtLink :to="localePath('/programs/undulating')">
        волновая (Undulating)
      </NuxtLink>
    </li>
    <li>
      <NuxtLink :to="localePath('/programs/block')">
        блок (Block)
      </NuxtLink>
    </li>
  </ul>
</template>

<style src="./style.css" />

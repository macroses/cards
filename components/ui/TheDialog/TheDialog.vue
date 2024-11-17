<script setup lang="ts">

</script>

<template>
  <dialog>
    <slot name="title" />
    <slot name="header" />
    <slot name="content" />
    <slot name="footer" />
    <TheButton
      variant="ghost"
      icon-only
      class="close-button"
    >
      <TheIcon
        icon-name="xmark"
        width="20px"
      />
    </TheButton>
  </dialog>
</template>

<style src="./style.css" />

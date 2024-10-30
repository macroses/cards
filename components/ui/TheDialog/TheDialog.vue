<script setup lang="ts">
import { useDialog } from '~/composables/dialog/useDialog'

const { dialogRef, openDialog, closeDialog } = useDialog()

defineExpose({
  openDialog,
  closeDialog,
})
</script>

<template>
  <dialog ref="dialogRef">
    <slot name="title" />
    <slot name="header" />
    <slot name="content" />
    <slot name="footer" />
    <TheButton
      variant="ghost"
      icon-only
      class="close-button"
      @click="closeDialog"
    >
      <TheIcon
        icon-name="xmark"
        width="20px"
      />
    </TheButton>
  </dialog>
</template>

<style src="./style.css" />

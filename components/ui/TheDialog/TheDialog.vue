<script setup lang="ts">
const dialogRef = ref<HTMLDialogElement | null>(null)

const openDialog = () => dialogRef.value?.showModal()

const closeDialog = () => dialogRef.value?.close()

onMounted(() => {
  dialogRef.value?.addEventListener('click', (e) => {
    if (e.target === dialogRef.value) {
      const rect = dialogRef.value?.getBoundingClientRect()
      const isInDialog = rect && (
        e.clientY > rect.top &&
        e.clientY < rect.bottom &&
        e.clientX > rect.left &&
        e.clientX < rect.right
      );
      if (!isInDialog) closeDialog()
    }
  })
})

defineExpose({
  openDialog,
  closeDialog
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
      <Icon
        name="ci:close-big"
        size="1rem"
      />
    </TheButton>
  </dialog>
</template>
  
<style scoped>
dialog {
  padding: 40px 20px 20px;
  border-radius: 8px;
  border: 1px solid #ccc;
  position: relative;
  max-width: 100%;
  min-width: 300px;
}

dialog::backdrop {
  background-color: rgba(0, 0, 0, 0.5);
}

.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
}
</style>
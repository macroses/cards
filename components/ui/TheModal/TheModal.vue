<script setup lang="ts">
interface ModalProps {
  isOutsideClose?: boolean
  bottomModal?: boolean
  hasCloseButton?: boolean
}

const {
  isOutsideClose = true,
  bottomModal = false,
  hasCloseButton = true,
} = defineProps<ModalProps>()

const dialogRef = useTemplateRef<HTMLDialogElement>('dialogRef')

function openModal() {
  dialogRef.value?.showModal()
  document.body.style.overflow = 'hidden'
}

function closeModal() {
  dialogRef.value?.close()
  document.body.style.overflow = ''
}

function handleBackdropClick(event: MouseEvent) {
  const rect = dialogRef.value?.getBoundingClientRect()
  if (!rect)
    return

  const isInDialog = rect.top <= event.clientY
    && event.clientY <= rect.top + rect.height
    && rect.left <= event.clientX
    && event.clientX <= rect.left + rect.width

  if (!isInDialog && isOutsideClose) {
    closeModal()
  }
}

onUnmounted(() => {
  document.body.style.overflow = ''
})

defineExpose({
  openModal,
  closeModal,
})
</script>

<template>
  <dialog
    ref="dialogRef"
    :class="{ 'bottom-modal': bottomModal }"
    @click="handleBackdropClick"
  >
    <div class="modal">
      <button
        v-if="hasCloseButton"
        class="close-button"
        @click="closeModal"
      >
        <TheIcon
          icon-name="xmark"
          width="20px"
        />
      </button>
      <div class="modal-header">
        <slot name="title" />
        <slot name="header" />
      </div>
      <div class="modal-content">
        <slot name="content" />
      </div>
      <div class="modal-footer">
        <slot name="footer" />
      </div>
    </div>
  </dialog>
</template>

<style src="./style.css" />

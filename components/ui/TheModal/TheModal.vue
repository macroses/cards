<script setup lang="ts">
interface ModalProps {
  isOutsideClose?: boolean
  bottomModal?: boolean
  hasCloseButton?: boolean
}

const props = withDefaults(defineProps<ModalProps>(), {
  isOutsideClose: true,
  bottomModal: false,
  hasCloseButton: true,
})

const isOpen = ref(false)
const modalRef = ref<HTMLDivElement | null>(null)

function openModal() {
  isOpen.value = true
  document.body.style.overflow = 'hidden'
}

function closeModal() {
  isOpen.value = false
  document.body.style.overflow = ''
}

function handleBackdropClick(event: MouseEvent) {
  if (event.target === modalRef.value && props.isOutsideClose) {
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
  <Transition :name="bottomModal ? 'bottom' : 'modal'">
    <div
      v-if="isOpen"
      ref="modalRef"
      class="modal-backdrop"
      :class="{ bottomModal }"
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
    </div>
  </Transition>
</template>

<style src="./style.css" />

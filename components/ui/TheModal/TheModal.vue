<script setup lang="ts">
defineProps<{
  bottomModal?: boolean
}>()

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
  if (event.target === modalRef.value) {
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
      <div
        class="modal"
      >
        <div class="modal-header">
          <slot name="title" />
          <slot name="header" />
          <button
            class="close-button"
            @click="closeModal"
          >
            <TheIcon
              icon-name="xmark"
              width="20px"
            />
          </button>
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

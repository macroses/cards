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

function handleBackdropClick(e: MouseEvent) {
  if (e.target === modalRef.value) {
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
      @click="handleBackdropClick"
    >
      <div class="modal">
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

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: var(--main-bg);
  border-radius: 12px;
  padding: 20px;
  max-width: 90%;
  min-width: 300px;
  position: relative;
  box-shadow: 0 10px 20px rgb(0 0 0 / 20%);
}

.modal-header {
  position: relative;
  margin-bottom: 16px;
}

.close-button {
  position: absolute;
  top: -10px;
  right: -10px;
  width: 36px;
  height: 36px;
  border: none;
  background: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgb(var(--text-color));
}

.modal-content {
  margin-bottom: 16px;
}

/* Анимации */
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: translateY(60px);
}

.modal-enter-active .modal,
.modal-leave-active .modal {
  transition: all 0.3s ease;
}

.modal-enter-from .modal,
.modal-leave-to .modal {
  opacity: 0;
  transform: translateY(-30px);
}
</style>

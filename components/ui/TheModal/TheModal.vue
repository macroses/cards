<script setup lang="ts">
interface ModalProps {
  isOutsideClose?: boolean
  hasCloseButton?: boolean
}

defineOptions({
  inheritAttrs: false,
})

const {
  isOutsideClose = true,
  hasCloseButton = true,
} = defineProps<ModalProps>()

const isOpen = ref(false)
const modalRef = useTemplateRef<HTMLDivElement>('modalRef')
const isMobile = useMediaQuery('(max-width: 768px)')

function openModal() {
  isOpen.value = true
  document.body.style.overflow = 'hidden'
}

function closeModal() {
  isOpen.value = false
  document.body.style.overflow = ''
}

function handleBackdropClick(event: MouseEvent) {
  if (event.target === modalRef.value && isOutsideClose) {
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
  <Teleport to="body">
    <Transition :name="isMobile ? 'bottom' : 'modal'">
      <div
        v-if="isOpen"
        ref="modalRef"
        v-bind="$attrs"
        class="modal-backdrop"
        :class="{ bottomModal: isMobile }"
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
              width="20"
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
  </Teleport>
</template>

<style src="./style.css" />

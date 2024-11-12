<script setup lang="ts">
import type { Toast, ToastType } from '~/ts/componentProps'

const toasts = ref<Toast[]>([])
const toastTimer = 7000
let toastId = 0

function removeToast(id: number) {
  const index = toasts.value.findIndex((toast: Toast) => toast.id === id)

  if (index !== -1) {
    toasts.value.splice(index, 1)
  }
}

function addToast(message: string, type: ToastType = 'info') {
  const id = toastId++

  toasts.value.push({ id, message, type })
  setTimeout(() => removeToast(id), toastTimer)
}

const { setToastFunction } = useToastState()

onMounted(() => {
  setToastFunction(addToast)
})

onUnmounted(() => {
  setToastFunction(() => {
    console.warn('Toast function is not available')
  })
})
</script>

<template>
  <div
    class="toaster"
  >
    <TransitionGroup
      name="toast"
      tag="div"
      class="toaster-container"
    >
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="toast"
        :class="[`toast-${toast.type}`]"
      >
        <TheIcon
          v-if="toast.type === 'info'"
          icon-name="lightbulb"
          width="20px"
        />
        <TheIcon
          v-else-if="toast.type === 'success'"
          icon-name="badge-check"
          width="20px"
        />
        <TheIcon
          v-else
          icon-name="triangle-exclamation"
          width="20px"
        />
        <p class="toast-message">
          {{ toast.message }}
        </p>
        <button
          class="close-toast-button"
          @click="removeToast(toast.id)"
        >
          <TheIcon
            icon-name="xmark"
            width="12px"
            class="close-icon"
          />
          <svg class="progress-ring" viewBox="0 0 36 36">
            <circle
              cx="18"
              cy="18"
              r="16"
              fill="none"
              stroke="currentColor"
              stroke-width="1"
              stroke-dasharray="100"
              stroke-dashoffset="0"
              transform="rotate(-90 18 18)"
            >
              <animate
                attributeName="stroke-dashoffset"
                from="0"
                to="100"
                :dur="`${toastTimer}ms`"
                fill="freeze"
              />
            </circle>
          </svg>
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.toaster {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
}

.toaster-container {
  position: relative;
}

.toast {
  display: flex;
  align-items: center;
  gap: 12px;

  padding: 10px 20px;
  margin-bottom: 10px;
  border-radius: 12px;
  color: rgb(var(--text-color));
  font-size: 12px;
  max-width: 360px;
  background-color: var(--main-bg);
  border: 1px solid rgb(var(--accent-color) / 0.3);
  box-shadow: rgba(0, 0, 0, 0.08) 0 4px 12px;
}

svg {
  min-width: 20px;
}

.close-toast-button {
  position: relative;
  width: 24px;
  height: 24px;
  border: none;
  background: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgb(var(--text-color));
  margin-left: auto;
}

.close-icon {
  min-width: 14px;
  position: absolute;
  z-index: 1;
}

.progress-ring {
  position: absolute;
  width: 24px;
  height: 24px;
}

.toast-success {
  color: rgb(76 175 80);
  border: 1px solid rgb(76 175 80 / 0.5);
}

.toast-error {
  color: rgb(244 67 54);
  border: 1px solid rgb(244 67 54 / 0.5);
}

.toast-info {
  color: rgb(var(--accent-color));
  border: 1px solid rgb(var(--accent-color) / 0.5);
}

/* Анимации для TransitionGroup */
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>

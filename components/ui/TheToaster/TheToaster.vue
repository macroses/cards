<script setup lang="ts">
import type { Toast, ToastType } from '~/ts/componentProps'

const props = withDefaults(defineProps<{
  ms?: number
}>(), {
  ms: 7000,
})

const toasts = ref<Toast[]>([])
const toastTimer = props.ms || 7000
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
    v-auto-animate="{ duration: 100 }"
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

<style scoped src="./style.css" />

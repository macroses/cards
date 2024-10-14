<script setup lang="ts">
interface Toast {
  id: number
  message: string
  type: 'success' | 'error' | 'info'
}

type ToastType = 'success' | 'error' | 'info'

const toasts = ref<Toast[]>([])
let toastId = 0

const addToast = (message: string, type: ToastType = 'info') => {
  const id = toastId++

  toasts.value.push({ id, message, type })
  setTimeout(() => removeToast(id), 3000)
}

const removeToast = (id: number) => {
  const index = toasts.value.findIndex(toast => toast.id === id)

  if (index !== -1) {
    toasts.value.splice(index, 1)
  }
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
  <div class="toaster">
    <transition-group name="toast">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        :class="['toast', `toast-${toast.type}`]"
      >
        {{ toast.message }}
      </div>
    </transition-group>
  </div>
</template>

<style scoped>
.toaster {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
}

.toast {
  padding: 10px 20px;
  margin-bottom: 10px;
  border-radius: 4px;
  color: white;
  font-weight: bold;
  max-width: 300px;
}

.toast-success {
  background-color: #4caf50;
}

.toast-error {
  background-color: #f44336;
}

.toast-info {
  background-color: #2196f3;
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>
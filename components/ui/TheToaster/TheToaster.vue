<script setup lang="ts">
import type { Toast, ToastType } from '~/ts/componentProps'
import type { NewRecord } from '~/ts/types/personalRecords.types'
import { markRaw } from 'vue'
import RecordToastContent from '~/components/PersonalRecords/RecordToastContent.vue'

const props = withDefaults(defineProps<{
  ms?: number
  customMs?: number
}>(), {
  ms: 5000,
  customMs: -1,
})

const RecordToastContentRaw = markRaw(RecordToastContent)

const toasts = ref<Toast[]>([])
let toastId = 0
const timeouts = new Map<number, NodeJS.Timeout>()

function removeToast(id: number) {
  const index = toasts.value.findIndex((toast: Toast) => toast.id === id)

  if (index !== -1) {
    toasts.value.splice(index, 1)
  }

  const timeout = timeouts.get(id)
  if (timeout) {
    clearTimeout(timeout)
    timeouts.delete(id)
  }
}

function addToast(message: string, type: ToastType = 'info') {
  const id = toastId++
  toasts.value.push({ id, message, type })

  const timeout = setTimeout(() => removeToast(id), props.ms)
  timeouts.set(id, timeout)
}

function addCustomToast(component: Component, componentProps: Record<string, any> = {}) {
  const id = toastId++

  toasts.value.push({
    id,
    type: 'custom',
    component: markRaw(component),
    componentProps,
  })

  // Используем ms из componentProps, если оно есть, иначе используем props.customMs
  const timeout = setTimeout(
    () => removeToast(id),
    componentProps.ms || props.customMs,
  )

  timeouts.set(id, timeout)
}

function addRecordToast(records: NewRecord[], options?: { ms?: number }) {
  if (records.length > 0) {
    addCustomToast(RecordToastContentRaw, {
      records,
      ms: options?.ms,
    })
  }
}

function getToastDuration(toast: Toast) {
  if (toast.type === 'custom') {
    return toast.componentProps?.ms || props.customMs
  }
  return props.ms
}

const { setToastFunction, setCustomToastFunction } = useToastState()

onMounted(() => {
  setToastFunction(addToast)
  setCustomToastFunction(addCustomToast)

  const { setRecordToastFunction } = usePersonalRecords()
  setRecordToastFunction(addRecordToast)
})

onUnmounted(() => {
  timeouts.forEach(timeout => clearTimeout(timeout))
  timeouts.clear()
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
        <template v-if="toast.type !== 'custom'">
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
        </template>

        <!-- Кастомные компоненты -->
        <component
          :is="toast.component"
          v-else-if="toast.component"
          v-bind="toast.componentProps || {}"
        />

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
                :dur="`${getToastDuration(toast)}ms`"
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

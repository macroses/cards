type ToastFunction = (message: string, type: 'success' | 'error' | 'info') => void

const toastFunction = ref<ToastFunction | null>(null)

export function useToastState() {
  const setToastFunction = (fn: ToastFunction) => {
    toastFunction.value = fn
  }

  const toast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    if (toastFunction.value) {
      toastFunction.value(message, type)
    }
    else {
      console.warn('Toast function is not available')
    }
  }

  return {
    setToastFunction,
    toast,
  }
}

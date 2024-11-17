type ToastFunction = (message: string, type?: 'success' | 'error' | 'info') => void

const toastFunction = ref<ToastFunction>(() => {
  console.warn('Toast function is not yet initialized')
})

export function useToastState() {
  function setToastFunction(fn: ToastFunction) {
    toastFunction.value = fn
  }

  function toast(message: string, type: 'success' | 'error' | 'info' = 'info') {
    toastFunction.value(message, type)
  }

  return {
    setToastFunction,
    toast,
  }
}

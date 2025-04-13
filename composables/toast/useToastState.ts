type ToastFunction = (message: string, type?: 'success' | 'error' | 'info') => void
type CustomToastFunction = (
  component: Component,
  componentProps?: Record<string, any>
) => void

const toastFunction = ref<ToastFunction>(() => {
  console.warn('Toast function is not yet initialized')
})

const customToastFunction = ref<CustomToastFunction>(() => {
  console.warn('Custom toast function is not yet initialized')
})

export function useToastState() {
  function setToastFunction(fn: ToastFunction) {
    toastFunction.value = fn
  }

  function setCustomToastFunction(fn: CustomToastFunction) {
    customToastFunction.value = fn
  }

  function toast(message: string, type: 'success' | 'error' | 'info' = 'info') {
    toastFunction.value(message, type)
  }

  function customToast(component: Component, componentProps: Record<string, any> = {}) {
    // Используем markRaw для предотвращения реактивности компонента
    customToastFunction.value(markRaw(component), componentProps)
  }

  return {
    setToastFunction,
    setCustomToastFunction,
    toast,
    customToast,
  }
}

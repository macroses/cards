export default defineNuxtPlugin(() => {
    return {
      provide: {
        toast: (message: string, type: 'success' | 'error' | 'info' = 'info') => {
          // Это заглушка, которая будет заменена реальной функцией в TheToaster.vue
          console.warn('Toast function is not yet initialized')
        }
      }
    }
  })
export default defineNuxtPlugin(() => {
  return {
    provide: {
      // eslint-disable-next-line
      toast: (message: string, type: 'success' | 'error' | 'info' = 'info') => {
        // Это заглушка, которая будет заменена реальной функцией в TheToaster.vue
        console.warn('Toast function is not yet initialized')
      },
    },
  }
})

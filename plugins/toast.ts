export default defineNuxtPlugin(() => {
  return {
    provide: {
      toast: () => {
        // Это заглушка, которая будет заменена реальной функцией в TheToaster.vue
        console.warn('Toast function is not yet initialized')
      },
    },
  }
})

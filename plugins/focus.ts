import { vFocus } from '~/directives/focus'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive('focus', vFocus)
})

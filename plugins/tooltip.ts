import { defineNuxtPlugin } from '#app'
import VTooltip from '~/directives/v-tooltip'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive('tooltip', VTooltip)
})

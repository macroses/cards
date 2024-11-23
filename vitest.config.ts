import { defineVitestConfig } from '@nuxt/test-utils/config'

export default defineVitestConfig({
  test: {
    environment: 'nuxt',
    environmentOptions: {
      nuxt: {
        overrides: {
          modules: ['@nuxtjs/i18n'],
        },
      },
    },
    setupFiles: ['./tests/setup.ts'],
  },
})

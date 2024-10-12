export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  css: ['~/assets/styles/main.css'],
  modules: [
    '@sidebase/nuxt-auth',
    '@vueuse/nuxt',
    '@nuxtjs/i18n',
    '@nuxt/icon'
  ],
  auth: {
    globalAppMiddleware: true,
    baseURL: `http://localhost:${process.env.PORT || 3000}`
  },
  runtimeConfig: {
    GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    API_ROUTE_SECRET: process.env.API_ROUTE_SECRET,
    public: {
      GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
      GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID
    }
  },
  i18n: {
    vueI18n: './i18n.config.ts'
  },
  icon: {
    serverBundle: {
      collections: ['mage', 'solar']
    }
  },
  components: [
    {
      path: '~/components',
      pathPrefix: false,
    }
  ]
})
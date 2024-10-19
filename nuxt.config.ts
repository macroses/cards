import process from 'node:process'

export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  // app: {
  //   pageTransition: { name: 'page', mode: 'out-in' },
  // },
  css: ['~/assets/styles/main.css'],
  modules: [
    '@nuxtjs/i18n',
    '@nuxt/icon',
    'nuxt-time',
    '@nuxt/eslint',
    '@nuxt/image',
    '@sidebase/nuxt-auth',
    'dayjs-nuxt',
    '@vee-validate/nuxt',
    '@vueuse/nuxt',
    '@vite-pwa/nuxt',
  ],
  auth: {
    globalAppMiddleware: true,
    baseURL: `http://localhost:${process.env.PORT || 3000}`,
    provider: {
      type: 'authjs',
    },
  },
  runtimeConfig: {
    GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    API_ROUTE_SECRET: process.env.API_ROUTE_SECRET,
    public: {
      GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
      GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    },
  },
  i18n: {
    vueI18n: './i18n.config.ts',
  },
  icon: {
    serverBundle: {
      collections: ['mage', 'solar'],
    },
  },
  components: [
    {
      path: '~/components',
      pathPrefix: false,
    },
  ],
  // pwa: {
  //   registerType: 'autoUpdate',
  //   manifest: {
  //     name: 'Моё PWA приложение',
  //     short_name: 'PWA App',
  //     theme_color: '#ffffff',
  //     icons: [
  //       {
  //         src: 'pwa-192x192.png',
  //         sizes: '192x192',
  //         type: 'image/png',
  //       },
  //       {
  //         src: 'pwa-512x512.png',
  //         sizes: '512x512',
  //         type: 'image/png',
  //       },
  //       {
  //         src: 'pwa-512x512.png',
  //         sizes: '512x512',
  //         type: 'image/png',
  //         purpose: 'any maskable',
  //       },
  //     ],
  //   },
  //   workbox: {
  //     navigateFallback: '/',
  //     globPatterns: ['**/*.{js,css,html,png,svg,ico}'],
  //   },
  //   client: {
  //     installPrompt: true,
  //   },
  //   devOptions: {
  //     enabled: true,
  //     type: 'module',
  //   },
  // },
})

import { process } from 'std-env'

export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',

  vue: {
    compilerOptions: {
      isCustomElement: tag => [
        'selectedcontent',
        'selectmenu',
      ].includes(tag),
    },
  },

  experimental: {
    viewTransition: true,
  },

  css: ['~/assets/styles/main.css'],

  modules: [
    '@nuxtjs/i18n',
    '@nuxt/eslint',
    '@nuxt/image',
    '@nuxt/test-utils/module',
    '@sidebase/nuxt-auth',
    'dayjs-nuxt',
    '@vee-validate/nuxt',
    '@vueuse/nuxt',
    '@formkit/auto-animate/nuxt',
    'nuxt-echarts',
    'motion-v/nuxt',
    '@vite-pwa/nuxt',
  ],

  auth: {
    globalAppMiddleware: true,
    baseURL: `http://localhost:${process.env.PORT || 3000}/api/auth`,
    provider: {
      type: 'authjs',
    },
  },

  runtimeConfig: {
    GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    API_ROUTE_SECRET: process.env.API_ROUTE_SECRET,
    JWT_SECRET: process.env.JWT_SECRET,
    NODE_ENV: process.env.NODE_ENV,
    public: {
      GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
      GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    },
  },

  i18n: {
    vueI18n: './i18n.config.ts',
    defaultLocale: 'en',
    locales: ['en', 'ru'],
    strategy: 'prefix',
  },

  components: [
    {
      path: '~/components',
      pathPrefix: false,
    },
  ],

  imports: {
    dirs: [
      'composables/**',
    ],
  },

  devtools: {
    enabled: false,
  },

  echarts: {
    ssr: true,
    renderer: ['svg'],
    charts: [
      'LineChart',
      'BarChart',
      'MapChart',
      'ScatterChart',
      'PieChart',
      'RadarChart',
      'TreeChart',
      'GraphChart',
    ],
    components: [
      'DatasetComponent',
      'GridComponent',
      'TooltipComponent',
      'ToolboxComponent',
      'GeoComponent',
      'VisualMapComponent',
      'LegendComponent',
      'TitleComponent',
    ],
  },

  nitro: {
    routeRules: {
      '/**': {
        headers: {
          'X-XSS-Protection': '1; mode=block',
          'X-Frame-Options': 'SAMEORIGIN',
          'X-Content-Type-Options': 'nosniff',
          'Referrer-Policy': 'strict-origin-when-cross-origin',
          'Content-Security-Policy': 'default-src \'self\'; script-src \'self\' \'unsafe-inline\' \'unsafe-eval\'; style-src \'self\' \'unsafe-inline\'; img-src \'self\' data: blob:; font-src \'self\' data:',
        },
      },
      '/api/**': {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
          'Pragma': 'no-cache',
        },
      },
    },
  },
})

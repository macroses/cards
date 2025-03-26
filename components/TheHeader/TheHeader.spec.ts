import type { I18nOptions } from 'vue-i18n'
import { shallowMount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ref } from 'vue'
import { createI18n } from 'vue-i18n'
import TheHeader from './TheHeader.vue'

const i18nOptions: I18nOptions = {
  legacy: false,
  locale: 'ru',
  fallbackLocale: 'en',
  messages: {
    ru: {},
    en: {},
  },
}

const i18n = createI18n(i18nOptions)

vi.mock('~/composables/auth/useAuth', () => ({
  useAuth: () => ({
    signOut: vi.fn(),
    data: { value: { name: 'Test User' } },
  }),
}))

vi.mock('~/composables/setLanguage/useChangeLanguage', () => ({
  useChangeLanguage: () => {
    const locale = ref('ru')
    const changeLanguage = vi.fn()
    const initLanguage = vi.fn()

    return {
      locale,
      changeLanguage,
      initLanguage,
      setLocale: vi.fn(),
    }
  },
}))

vi.mock('~/composables/workout/useWorkoutTimer', () => ({
  useWorkoutTimer: () => ({
    timer: ref('00:00:00'),
    activeWorkout: ref<{ id: string } | null>(null),
  }),
}))

vi.mock('#app', () => ({
  useNuxtApp: () => ({
    $i18n: {
      locale: 'ru',
      setLocale: vi.fn(),
    },
  }),
}))

vi.mock('#imports', () => ({
  useLocalePath: () => (path: string) => path,
}))

describe('тестирует TheHeader', () => {
  let wrapper: ReturnType<typeof shallowMount>

  beforeEach(() => {
    wrapper = shallowMount(TheHeader, {
      global: {
        plugins: [i18n],
        stubs: {
          NuxtLink: {
            template: '<a :href="to"><slot /></a>',
            props: ['to'],
          },
          TheIcon: true,
          TheDetails: true,
          TheDialog: true,
        },
        mocks: {
          localePath: (path: string) => path,
        },
      },
    })
  })

  it('рендерит основные компоненты', () => {
    expect(wrapper.findComponent({ name: 'TheIcon' }).exists()).toBe(true)
    expect(wrapper.findComponent({ name: 'TheDetails' }).exists()).toBe(true)
    expect(wrapper.findComponent({ name: 'TheDialog' }).exists()).toBe(true)
  })

  it('не отображает таймер, если нет активной тренировки', () => {
    const timer = wrapper.find('.header__timer')
    expect(timer.exists()).toBe(false)
  })

  it('отображает таймер при наличии активной тренировки', async () => {
    const mockWorkoutTimer = useWorkoutTimer()
    mockWorkoutTimer.activeWorkout.value = {
      id: ' 1',
      startedAt: new Date(),
    }
    mockWorkoutTimer.timer.value = '00:10:00'

    await nextTick()
    const timer = wrapper.find('.header__timer')
    expect(timer.exists()).toBe(true)
    expect(timer.text()).toBe('00:10:00')
  })
})

import { shallowMount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ref } from 'vue'
import TheHeader from './TheHeader.vue'

vi.mock('vue-i18n', () => ({
  useI18n: () => ({
    t: (key: string) => key,
    locale: ref('ru'),
    setLocale: vi.fn(),
  }),
}))

vi.mock('~/composables/auth/useAuth', () => ({
  useAuth: () => ({
    signOut: vi.fn(),
    data: { value: { name: 'Test User' } },
  }),
}))

vi.mock('~/composables/language/useChangeLanguage', () => ({
  useChangeLanguage: () => ({
    locale: ref('ru'),
    changeLanguage: vi.fn(),
    initLanguage: vi.fn(),
    setLocale: vi.fn(),
  }),
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

  it('содержит корректные ссылки навигации', () => {
    const links = wrapper.findAll('a')
    const expectedPaths = ['/', '/statistics', '/exercises']

    links.forEach((link, index) => {
      expect(link.attributes('href')).toBe(expectedPaths[index])
    })
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

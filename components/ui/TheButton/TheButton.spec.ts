import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import TheButton from './TheButton.vue'

// Мок для NuxtLink
const NuxtLinkStub = {
  name: 'NuxtLink',
  props: ['to'],
  template: '<a :href="to"><slot /></a>',
}

// Мок для i18n
const i18nMock = {
  t: (key: string) => key,
  locale: {
    value: 'ru',
  },
}

describe('theButton', () => {
  const globalConfig = {
    stubs: {
      NuxtLink: NuxtLinkStub,
    },
    mocks: {
      $t: i18nMock.t,
      $i18n: i18nMock,
    },
  }

  it('рендерит кнопку с дефолтными пропсами', () => {
    const wrapper = mount(TheButton, {
      global: globalConfig,
    })
    expect(wrapper.find('button').exists()).toBe(true)
    expect(wrapper.classes()).toContain('button')
    expect(wrapper.classes()).toContain('button--primary')
  })

  it('рендерит кнопку с переданным вариантом', () => {
    const wrapper = mount(TheButton, {
      global: globalConfig,
      props: {
        variant: 'ghost',
      },
    })
    expect(wrapper.classes()).toContain('button--ghost')
  })

  it('рендерит disabled кнопку', () => {
    const wrapper = mount(TheButton, {
      global: globalConfig,
      props: {
        disabled: true,
      },
    })
    expect(wrapper.attributes('disabled')).toBeDefined()
  })

  it('рендерит NuxtLink если передан prop link', () => {
    const wrapper = mount(TheButton, {
      global: globalConfig,
      props: {
        link: true,
        linkPath: '/test',
      },
    })
    const nuxtLink = wrapper.findComponent(NuxtLinkStub)
    expect(nuxtLink.exists()).toBe(true)
    expect(nuxtLink.attributes('href')).toBe('/test')
  })

  it('рендерит слот контент', () => {
    const wrapper = mount(TheButton, {
      global: globalConfig,
      slots: {
        default: 'Click me',
      },
    })
    expect(wrapper.text()).toBe('Click me')
  })
})

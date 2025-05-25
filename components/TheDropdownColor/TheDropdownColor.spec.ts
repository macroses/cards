import type { I18nOptions } from 'vue-i18n'
import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it } from 'vitest'
import { createI18n } from 'vue-i18n'
import { WORKOUT_COLORS } from '~/constants/workout'
import TheDropdownColor from './TheDropdpownColor.vue'

const i18nOptions: I18nOptions = {
  legacy: false,
  locale: 'ru',
  messages: {
    ru: {
      workout: {
        dropdown_color: 'Выбрать цвет',
      },
    },
    en: {
      workout: {
        dropdown_color: 'Select color',
      },
    },
    fr: {
      workout: {
        dropdown_color: 'Choisir une couleur',
      },
    },
  },
}

const i18n = createI18n(i18nOptions)

describe('тестирует TheDropdownColor', () => {
  const defaultProps = {
    initialColor: WORKOUT_COLORS[0].rgb,
  }

  let wrapper: ReturnType<typeof mount>

  beforeEach(() => {
    wrapper = mount(TheDropdownColor, {
      props: defaultProps,
      global: {
        plugins: [i18n],
        stubs: {
          TheIcon: true,
        },
      },
    })
  })

  it('рендерит компонент с начальным цветом', () => {
    const colorResult = wrapper.find('.dropdown-color__result')
    expect(colorResult.attributes('style')).toContain(`background-color: rgb(${defaultProps.initialColor})`)
  })

  it('эмитит событие dropColor при выборе цвета', async () => {
    const container = wrapper.find('.dropdown-color__container')
    await container.trigger('click')

    const colorItem = wrapper.find('.dropdown-color li')
    await colorItem.trigger('click')

    expect(wrapper.emitted('dropColor')).toBeTruthy()
    expect(wrapper.emitted('dropColor')?.[0]).toEqual([WORKOUT_COLORS[0].rgb])
  })

  it('обновляет выбранный цвет при изменении initialColor', async () => {
    const newColor = WORKOUT_COLORS[1].rgb
    await wrapper.setProps({ initialColor: newColor })

    const colorResult = wrapper.find('.dropdown-color__result')
    expect(colorResult.attributes('style')).toContain(`background-color: rgb(${newColor})`)
  })

  it('отмечает активный цвет в списке', async () => {
    const container = wrapper.find('.dropdown-color__container')
    await container.trigger('click')

    const activeColorItem = wrapper.find('.dropdown-color li.active')
    expect(activeColorItem.exists()).toBe(true)
    expect(activeColorItem.attributes('style')).toContain(`background-color: rgb(${defaultProps.initialColor})`)
  })
})

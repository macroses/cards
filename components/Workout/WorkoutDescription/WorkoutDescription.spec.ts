import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it } from 'vitest'
import { createI18n, type I18nOptions } from 'vue-i18n'
import WorkoutDescription from './WorkoutDescription.vue'

const i18nOptions: I18nOptions = {
  legacy: false,
  locale: 'ru',
  messages: {
    ru: {
      workout: {
        change_date: 'Изменить дату',
        dropdown_color: 'Выбрать цвет',
      },
      validation: {
        required: 'Обязательное поле',
        maxLength: 'Максимальная длина {n} символов',
      },
    },
    en: {
      workout: {
        change_date: 'Change date',
        dropdown_color: 'Select color',
      },
      validation: {
        required: 'Required',
        maxLength: 'Maximum {n} characters',
      },
    },
  },
}

const i18n = createI18n(i18nOptions)

describe('workoutDescription', () => {
  const defaultProps = {
    selectedDate: new Date('2024-01-01'),
    title: 'Test Workout',
    color: '213, 0, 0',
  }

  let wrapper: ReturnType<typeof mount>

  beforeEach(() => {
    wrapper = mount(WorkoutDescription, {
      props: defaultProps,
      global: {
        plugins: [i18n],
        directives: {
          tooltip: () => {},
        },
      },
    })
  })

  it('рендерит компонент с переданными пропсами', () => {
    const input = wrapper.findComponent({ name: 'TheInput' })
    const colorDropdown = wrapper.findComponent({ name: 'TheDropdpownColor' })
    const dateButton = wrapper.findComponent({ name: 'TheButton' })

    expect(input.exists()).toBe(true)
    expect(colorDropdown.exists()).toBe(true)
    expect(dateButton.exists()).toBe(true)
  })

  it('обновляет название тренировки при изменении title prop', async () => {
    const newTitle = 'New Workout Title'
    await wrapper.setProps({ title: newTitle })

    const input = wrapper.findComponent({ name: 'TheInput' })
    expect(input.props('modelValue')).toBe(newTitle)
  })

  it('эмитит workoutTitle при вводе названия', async () => {
    const input = wrapper.findComponent({ name: 'TheInput' })
    await input.vm.$emit('update:modelValue', 'New Title')

    expect(wrapper.emitted('workoutTitle')).toBeTruthy()
    expect(wrapper.emitted('workoutTitle')?.[0]).toEqual(['New Title'])
  })
})

import type { I18nOptions } from 'vue-i18n'
import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it } from 'vitest'
import { createI18n } from 'vue-i18n'
import WorkoutFunctions from './WorkoutFunctions.vue'

const i18nOptions: I18nOptions = {
  legacy: false,
  locale: 'ru',
  messages: {
    ru: {
      main_navigation: {
        copy_workout: 'Копировать тренировку',
        edit_workout: 'Редактировать тренировку',
        delete_workout: 'Удалить тренировку',
      },
    },
    en: {
      main_navigation: {
        copy_workout: 'Copy workout',
        edit_workout: 'Edit workout',
        delete_workout: 'Delete workout',
      },
    },
  },
}

const i18n = createI18n(i18nOptions)

describe('workoutFunctions', () => {
  const defaultProps = {
    workoutTitle: 'Тестовая тренировка',
    isCopyMode: false,
    workoutId: '1',
    isWorkoutActive: false,
  }

  let wrapper: ReturnType<typeof mount>

  beforeEach(() => {
    wrapper = mount(WorkoutFunctions, {
      props: defaultProps,
      global: {
        plugins: [i18n],
        directives: {
          tooltip: () => {},
        },
      },
    })
  })

  it('рендерит компонент с названием тренировки', () => {
    const title = wrapper.find('.date-menu__event-name')
    expect(title.text()).toBe('Тестовая тренировка')
  })

  it('эмитит событие copyWorkout при клике на кнопку копирования', async () => {
    // Open dropdown first
    const dropdownToggle = wrapper.find('.date-menu__dropdown button')
    await dropdownToggle.trigger('click')

    const copyButton = wrapper.find('.date-menu__dropdown-item')
    await copyButton.trigger('click')

    expect(wrapper.emitted('copyWorkout')).toBeTruthy()
  })

  it('эмитит событие updateWorkout при клике на кнопку редактирования', async () => {
    // Open dropdown first
    const dropdownToggle = wrapper.find('.date-menu__dropdown button')
    await dropdownToggle.trigger('click')

    const editButton = wrapper.findAll('.date-menu__dropdown-item')[1]
    await editButton.trigger('click')

    expect(wrapper.emitted('updateWorkout')).toBeTruthy()
  })

  it('эмитит событие deleteWorkout при клике на кнопку удаления', async () => {
    // Open dropdown first
    const dropdownToggle = wrapper.find('.date-menu__dropdown button')
    await dropdownToggle.trigger('click')

    const deleteButton = wrapper.findAll('.date-menu__dropdown-item')[2]
    await deleteButton.trigger('click')

    expect(wrapper.emitted('deleteWorkout')).toBeTruthy()
  })
})

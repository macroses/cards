import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it } from 'vitest'
import { createI18n } from 'vue-i18n'
import WorkoutFunctions from './WorkoutFunctions.vue'

describe('workoutFunctions', () => {
  const i18n = createI18n({
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
    },
  })

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

  it('отображает все кнопки функций', () => {
    const buttons = wrapper.findAll('.date-menu__functions-item button')
    expect(buttons).toHaveLength(3)
  })

  it('эмитит событие copyWorkout при клике на кнопку копирования', async () => {
    const copyButton = wrapper.find('.date-menu__functions-item button')
    await copyButton.trigger('click')

    expect(wrapper.emitted('copyWorkout')).toBeTruthy()
  })

  it('эмитит событие updateWorkout при клике на кнопку редактирования', async () => {
    const editButton = wrapper.findAll('.date-menu__functions-item button')[1]
    await editButton.trigger('click')

    expect(wrapper.emitted('updateWorkout')).toBeTruthy()
  })

  it('эмитит событие deleteWorkout при клике на кнопку удаления', async () => {
    const deleteButton = wrapper.findAll('.date-menu__functions-item button')[2]
    await deleteButton.trigger('click')

    expect(wrapper.emitted('deleteWorkout')).toBeTruthy()
  })
})

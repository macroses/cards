import type { I18nOptions } from 'vue-i18n'
import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it } from 'vitest'
import { createI18n } from 'vue-i18n'
import { DIFFICULT_LEVEL } from '~/ts/enums/workoutColors.enum'
import WorkoutExercises from './WorkoutExercises.vue'

const i18nOptions: I18nOptions = {
  legacy: false,
  locale: 'ru',
  messages: {
    ru: {
      workout: {
        add_exercise: 'Добавьте упражнение',
      },
    },
    en: {
      workout: {
        add_exercise: 'Add exercise',
      },
    },
  },
}

const i18n = createI18n(i18nOptions)

describe('workoutExercises', () => {
  const defaultProps = {
    selectedExercises: [
      { id: '1', name: 'Приседания' },
      { id: '2', name: 'Жим лежа' },
    ],
    sessions: [
      {
        id: 'session1',
        exerciseId: '1',
        weight: 100,
        repeats: 10,
        difficulty: DIFFICULT_LEVEL.MEDIUM,
        completed: false,
        setTime: null,
      },
    ],
    workoutDate: new Date('2024-01-01'),
  }

  let wrapper: ReturnType<typeof mount>

  beforeEach(() => {
    wrapper = mount(WorkoutExercises, {
      props: defaultProps,
      global: {
        plugins: [i18n],
        stubs: {
          WorkoutTonnage: true,
          WorkoutLastSessions: true,
          WorkoutDifficulty: true,
        },
        directives: {
          'tooltip': () => {},
          'auto-animate': () => {},
        },
      },
    })
  })

  it('рендерит список упражнений', () => {
    const exercises = wrapper.findAll('.workout__exercises-item')
    expect(exercises).toHaveLength(2)
  })

  it('эмитит событие removeExercise при клике на кнопку удаления', async () => {
    const deleteButton = wrapper.find('.workout__exercises-item-name .button')
    await deleteButton.trigger('click')

    expect(wrapper.emitted('removeExercise')).toBeTruthy()
    expect(wrapper.emitted('removeExercise')?.[0]).toEqual(['1']) // Change from 1 to '1'
  })

  it('отображает форму добавления сета при клике на упражнение', async () => {
    const exerciseTitle = wrapper.find('.workout__exercises-item-name')
    await exerciseTitle.trigger('click')

    const form = wrapper.find('.exercise-form')
    expect(form.exists()).toBe(true)
  })

  it('эмитит событие addSet при отправке формы', async () => {
    // Открываем форму
    const exerciseTitle = wrapper.find('.workout__exercises-item-name')
    await exerciseTitle.trigger('click')

    // Заполняем форму
    const weightInput = wrapper.find('input[placeholder="Вес"]')
    const repeatsInput = wrapper.find('input[placeholder="Повторения"]')
    await weightInput.setValue(100)
    await repeatsInput.setValue(10)

    // Отправляем форму
    const form = wrapper.find('.exercise-form')
    await form.trigger('submit')

    expect(wrapper.emitted('addSet')).toBeTruthy()
    expect(wrapper.emitted('addSet')?.[0][0]).toMatchObject({
      exerciseId: '1',
      weight: 100,
      repeats: 10,
      difficulty: DIFFICULT_LEVEL.WARM,
    })
  })

  it('отображает существующие сеты для упражнения', async () => {
    const exerciseTitle = wrapper.find('.workout__exercises-item-name')
    await exerciseTitle.trigger('click')

    const sets = wrapper.findAll('.workout-form__sets-item')
    expect(sets).toHaveLength(1)

    const weight = wrapper.find('.workout-form__sets--weight')
    const repeats = wrapper.find('.workout-form__sets--repeats')
    expect(weight.text()).toBe('100')
    expect(repeats.text()).toBe('10')
  })

  it('эмитит событие removeSet при удалении сета', async () => {
    const exerciseTitle = wrapper.find('.workout__exercises-item-name')
    await exerciseTitle.trigger('click')

    const deleteSetButton = wrapper.find('.workout-form__sets-item .button')
    await deleteSetButton.trigger('click')

    expect(wrapper.emitted('removeSet')).toBeTruthy()
    expect(wrapper.emitted('removeSet')?.[0]).toEqual(['session1'])
  })

  it('отображает сообщение, когда нет выбранных упражнений', async () => {
    await wrapper.setProps({
      selectedExercises: [],
    })

    const emptyMessage = wrapper.find('.exercises-empty')
    expect(emptyMessage.exists()).toBe(true)
    expect(emptyMessage.text()).toBe('Добавьте упражнение')
  })
})

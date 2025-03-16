import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it } from 'vitest'
import { createI18n } from 'vue-i18n'
import { DIFFICULT_LEVEL } from '~/ts/enums/workoutColors.enum'
import WorkoutTonnage from './WorkoutTonnage.vue'

describe('workoutTonnage', () => {
  const i18n = createI18n({
    legacy: false,
    locale: 'ru',
    messages: {
      ru: {
        workout: {
          total_tonnage: 'Общий тоннаж',
        },
      },
    },
  })

  const defaultProps = {
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
      {
        id: 'session2',
        exerciseId: '2',
        weight: 80,
        repeats: 12,
        difficulty: DIFFICULT_LEVEL.LOW,
        completed: false,
        setTime: null,
      },
    ],
    selectedExercisesLength: 2,
  }

  let wrapper: ReturnType<typeof mount>

  beforeEach(() => {
    wrapper = mount(WorkoutTonnage, {
      props: defaultProps,
      global: {
        plugins: [i18n],
        directives: {
          'auto-animate': () => {},
        },
      },
    })
  })

  it('рендерит компонент с общим тоннажем', () => {
    const tonnage = wrapper.find('.workout-total')
    expect(tonnage.exists()).toBe(true)
  })

  it('правильно рассчитывает общий тоннаж', () => {
    const tonnage = wrapper.find('.workout-total')
    // (100 * 10 + 80 * 12) / 1000 = 1.96T
    expect(tonnage.text()).toBe('Общий тоннаж: 1.96 T')
  })
})

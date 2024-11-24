import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ref } from 'vue'
import { createI18n } from 'vue-i18n'
import { DIFFICULT_LEVEL } from '~/ts/enums/workoutColors.enum'
import WorkoutLastSessions from './WorkoutLastSessions.vue'

// Мокаем composable до использования
vi.mock('~/composables/workoutManagment/useLastExerciseSets', () => {
  const mockLastSets = {
    1: [
      {
        id: 'set1',
        exerciseId: 1,
        weight: 100,
        repeats: 10,
        difficulty: DIFFICULT_LEVEL.MEDIUM,
      },
      {
        id: 'set2',
        exerciseId: 1,
        weight: 120,
        repeats: 8,
        difficulty: DIFFICULT_LEVEL.HIGH,
      },
    ],
  }

  return {
    useLastExerciseSets: () => ({
      lastSets: ref(mockLastSets),
    }),
  }
})

describe('workoutLastSessions', () => {
  const i18n = createI18n({
    legacy: false,
    locale: 'ru',
    messages: {
      ru: {
        workout: {
          previous_results: 'Предыдущие результаты',
        },
      },
    },
  })

  const defaultProps = {
    exerciseId: 1,
    activeExerciseId: 1,
    workoutDate: new Date('2024-01-01'),
    showSessions: true,
  }

  let wrapper: ReturnType<typeof mount>

  beforeEach(() => {
    wrapper = mount(WorkoutLastSessions, {
      props: defaultProps,
      global: {
        plugins: [i18n],
      },
    })
  })

  it('рендерит компонент с предыдущими результатами', () => {
    const title = wrapper.find('.previous-results__title')
    expect(title.text()).toBe('Предыдущие результаты')
  })

  it('отображает список предыдущих сетов', () => {
    const setItems = wrapper.findAll('.previous-results__item')
    expect(setItems).toHaveLength(2)
  })

  it('корректно отображает данные сета', () => {
    const firstSet = wrapper.findAll('.previous-results__item')[0]

    const weight = firstSet.find('.workout-form__sets--weight')
    const repeats = firstSet.find('.workout-form__sets--repeats')
    const difficulty = firstSet.find('.workout-form__sets--difficulty')

    expect(weight.text()).toBe('100')
    expect(repeats.text()).toBe('10')
    expect(difficulty.attributes('data-difficulty')).toBe(DIFFICULT_LEVEL.MEDIUM.toString())
  })

  it('не отображает компонент, если нет предыдущих сетов', async () => {
    await wrapper.setProps({
      exerciseId: 2, // ID упражнения без предыдущих сетов
    })

    const previousResults = wrapper.find('.previous-results')
    expect(previousResults.exists()).toBe(false)
  })

  it('не отображает компонент, если showSessions false', async () => {
    await wrapper.setProps({
      showSessions: false,
    })

    const previousResults = wrapper.find('.previous-results')
    expect(previousResults.exists()).toBe(false)
  })
})

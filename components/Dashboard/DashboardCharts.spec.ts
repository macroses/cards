import type { I18nOptions } from 'vue-i18n'
import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createI18n } from 'vue-i18n'
import DashboardCharts from './DashboardCharts.vue'

const mockCharts = [
  {
    title: 'dashboard.volumeAndIntensity',
    option: {
      series: [{ data: [1, 2, 3] }],
    },
    type: 'default',
  },
  {
    title: 'dashboard.exerciseProgress',
    option: {
      series: [{ data: [4, 5, 6] }],
    },
    type: 'exercise',
  },
]

const i18nOptions: I18nOptions = {
  legacy: false,
  locale: 'ru',
  messages: {
    ru: {
      dashboard: {
        volumeAndIntensity: 'Объем и интенсивность',
        exerciseProgress: 'Прогресс упражнений',
      },
    },
    en: {
      dashboard: {
        volumeAndIntensity: 'Volume and Intensity',
        exerciseProgress: 'Exercise Progress',
      },
    },
  },
}

const i18n = createI18n(i18nOptions)

const mockPopularExercises = [1, 2, 3]

vi.mock('~/composables/charts/useGlobalCharts', () => ({
  useGlobalCharts: () => ({
    charts: ref(mockCharts),
    selectedExercise: ref(1),
    popularExercises: ref(mockPopularExercises),
    getExerciseName: (id: number) => `Exercise ${id}`,
    isLoading: ref(false),
    error: ref(null),
  }),
}))

describe('dashboardCharts', () => {
  let wrapper: ReturnType<typeof mount>

  beforeEach(() => {
    wrapper = mount(DashboardCharts, {
      global: {
        plugins: [i18n],
        stubs: {
          'v-chart': {
            template: '<div class="chart-stub" />',
            props: ['option'],
          },
        },
      },
    })
  })

  it('рендерит все графики из массива charts', () => {
    const chartContainers = wrapper.findAll('.chart-container')
    expect(chartContainers).toHaveLength(mockCharts.length)
  })

  it('отображает заголовки графиков', () => {
    const titles = wrapper.findAll('.chart-container__title')
    expect(titles[0].text()).toBe('Объем и интенсивность')
    expect(titles[1].text()).toBe('Прогресс упражнений')
  })

  it('рендерит кнопки для популярных упражнений', () => {
    const exerciseButtons = wrapper.findAll('.exercise-list .button')
    expect(exerciseButtons).toHaveLength(mockPopularExercises.length)
  })

  it('отображает названия упражнений на кнопках', () => {
    const exerciseButtons = wrapper.findAll('.exercise-list .button')
    exerciseButtons.forEach((button, index) => {
      expect(button.text()).toBe(`Exercise ${mockPopularExercises[index]}`)
    })
  })

  it('применяет правильный класс к активному упражнению', () => {
    const exerciseButtons = wrapper.findAll('.exercise-list .button')
    expect(exerciseButtons[0].attributes('class')).toContain('button--primary')
    expect(exerciseButtons[1].attributes('class')).toContain('button--secondary')
  })

  it('отображает график упражнения только для типа exercise', () => {
    const exerciseChartContainer = wrapper.findAll('.exercise-chart-container')
    expect(exerciseChartContainer).toHaveLength(1)
  })
})

import type { I18nOptions } from 'vue-i18n'
import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ref } from 'vue'
import { createI18n } from 'vue-i18n'
import GlobalStatistics from './GlobalStatistics.vue'

vi.mock('~/composables/statistics/useGlobalStatistics', () => ({
  useGlobalStatistics: () => ({
    statistics: ref({
      maxTonnage: 2.5,
      totalTonnage: 15.8,
      avgWorkoutDuration: 45,
      avgSetTime: 90,
      completedWorkouts: 12,
      totalWorkouts: 15,
    }),
  }),
}))

const i18nOptions: I18nOptions = {
  legacy: false,
  locale: 'ru',
  messages: {
    ru: {
      statistics: {
        global_title: 'Общая статистика',
        max_tonnage: 'Максимальный тоннаж',
        total_tonnage: 'Общий тоннаж',
        avg_duration: 'Среднее время тренировки',
        avg_set_time: 'Среднее время подхода',
        completed_workouts: 'Завершенные тренировки',
      },
    },
    en: {
      statistics: {
        global_title: 'Global statistics',
        max_tonnage: 'Max tonnage',
        total_tonnage: 'Total tonnage',
        avg_duration: 'Average workout duration',
        avg_set_time: 'Average set time',
        completed_workouts: 'Completed workouts',
      },
    },
  },
}

const i18n = createI18n(i18nOptions)

describe('тестирует GlobalStatistics', () => {
  let wrapper: ReturnType<typeof mount>

  beforeEach(() => {
    wrapper = mount(GlobalStatistics, {
      global: {
        plugins: [i18n],
      },
    })
  })

  it('отображает максимальный тоннаж', () => {
    const maxTonnage = wrapper.findAll('.statistic-item')[0]
    expect(maxTonnage.find('.statistic-item__value').text()).toBe('2.5т')
    expect(maxTonnage.find('.statistic-item__label').text()).toBe('Максимальный тоннаж')
  })

  it('отображает общий тоннаж', () => {
    const totalTonnage = wrapper.findAll('.statistic-item')[1]
    expect(totalTonnage.find('.statistic-item__value').text()).toBe('15.8т')
    expect(totalTonnage.find('.statistic-item__label').text()).toBe('Общий тоннаж')
  })

  it('отображает среднее время тренировки', () => {
    const avgDuration = wrapper.findAll('.statistic-item')[2]
    expect(avgDuration.find('.statistic-item__value').text()).toBe('45мин')
    expect(avgDuration.find('.statistic-item__label').text()).toBe('Среднее время тренировки')
  })

  it('отображает среднее время подхода', () => {
    const avgSetTime = wrapper.findAll('.statistic-item')[3]
    expect(avgSetTime.find('.statistic-item__value').text()).toBe('90сек')
    expect(avgSetTime.find('.statistic-item__label').text()).toBe('Среднее время подхода')
  })

  it('отображает количество завершенных тренировок', () => {
    const completedWorkouts = wrapper.findAll('.statistic-item')[4]
    expect(completedWorkouts.find('.statistic-item__value').text()).toBe('12/15')
    expect(completedWorkouts.find('.statistic-item__label').text()).toBe('Завершенные тренировки')
  })

  it('отображает сетку статистики при наличии данных', () => {
    const statisticsGrid = wrapper.find('.global-statistics__grid')
    expect(statisticsGrid.exists()).toBe(true)
  })
})

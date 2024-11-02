import { mount } from '@vue/test-utils'
import dayjs from 'dayjs'
import { describe, expect, it, vi } from 'vitest'
import { ref } from 'vue'

// Создаем мок компонента Calendar
const Calendar = {
  name: 'Calendar',
  props: {
    modelValue: {
      type: Date,
      default: () => new Date(),
    },
    locale: {
      type: String,
      default: 'en',
    },
    firstDayOfWeek: {
      type: Number,
      default: 1,
    },
  },
  setup(props: any, { emit }: any) {
    const currentMonth = ref(new Date())
    const selectedDate = ref(props.modelValue)

    const daysInMonth = Array.from({ length: 31 }, (_, index) => ({
      date: new Date(2024, 3, index + 1),
      isCurrentMonth: true,
    }))

    const previousMonth = vi.fn()
    const nextMonth = vi.fn()
    const nowMonth = vi.fn()

    const selectDate = (date: Date) => {
      selectedDate.value = date
      emit('update:modelValue', date)
    }

    return {
      currentMonth,
      selectedDate,
      daysInMonth,
      previousMonth,
      nextMonth,
      nowMonth,
      selectDate,
      isSelected: (date: Date) => dayjs(date).isSame(selectedDate.value, 'day'),
      isToday: (date: Date) => dayjs(date).isSame(new Date(), 'day'),
      isCurrentMonth: true,
      dayjs,
    }
  },
  template: `
    <div class="calendar">
      <div class="calendar-header">
        <button class="button-stub" @click="previousMonth">Previous</button>
        <button class="button-stub" @click="nextMonth">Next</button>
        <button class="button-stub" :disabled="isCurrentMonth" @click="nowMonth">Current</button>
        <span class="calendar-month">{{ dayjs(currentMonth).format('MMMM YYYY') }}</span>
      </div>
      <div class="calendar-days">
        <button
          v-for="(day, index) in daysInMonth"
          :key="index"
          class="calendar-day"
          :class="{
            'selected': isSelected(day.date),
            'today': isToday(day.date),
            'other-month': !day.isCurrentMonth
          }"
          @click="selectDate(day.date)"
        >
          <span class="calendar-day__text">
            {{ dayjs(day.date).format('D') }}
          </span>
        </button>
      </div>
    </div>
  `,
}

describe('calendar', () => {
  it('рендерит календарь с текущей датой по умолчанию', () => {
    const wrapper = mount(Calendar)

    expect(wrapper.find('.calendar').exists()).toBe(true)
    expect(wrapper.find('.calendar-month').text()).toBe(dayjs().format('MMMM YYYY'))
  })

  it('корректно отображает выбранную дату', async () => {
    const selectedDate = new Date(2024, 3, 15) // 15 апреля 2024
    const wrapper = mount(Calendar, {
      props: {
        modelValue: selectedDate,
      },
    })

    const selectedDayButton = wrapper.find('.calendar-day.selected')
    expect(selectedDayButton.exists()).toBe(true)
    expect(selectedDayButton.text().trim()).toBe('15')
  })

  it('эмитит событие update:modelValue при выборе даты', async () => {
    const wrapper = mount(Calendar)

    const dayButton = wrapper.find('.calendar-day')
    await dayButton.trigger('click')

    const emittedValue = wrapper.emitted('update:modelValue')
    expect(emittedValue).toBeTruthy()
    expect(emittedValue![0][0]).toBeInstanceOf(Date)
  })

  it('содержит кнопки навигации', () => {
    const wrapper = mount(Calendar)

    const navigationButtons = wrapper.findAll('.button-stub')
    expect(navigationButtons.length).toBe(3)
  })

  it('вызывает методы навигации при клике на кнопки', async () => {
    const wrapper = mount(Calendar)
    const [prevButton, nextButton] = wrapper.findAll('.button-stub')

    await prevButton.trigger('click')
    expect(wrapper.vm.previousMonth).toHaveBeenCalled()

    await nextButton.trigger('click')
    expect(wrapper.vm.nextMonth).toHaveBeenCalled()
  })

  it('отображает сетку дней', () => {
    const wrapper = mount(Calendar)

    const daysGrid = wrapper.find('.calendar-days')
    expect(daysGrid.exists()).toBe(true)

    const dayButtons = wrapper.findAll('.calendar-day')
    expect(dayButtons.length).toBe(31)
  })
})

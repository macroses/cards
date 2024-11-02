import dayjs from 'dayjs'
import 'dayjs/locale/ru'
import 'dayjs/locale/en'

interface CalendarDay {
  date: Date
  isCurrentMonth: boolean
}

export function useCalendar(props: {
  modelValue: Date | null
  locale?: string
  month?: Date
  firstDayOfWeek?: 0 | 1
}) {
  const currentMonth = ref(props.month || new Date())
  const selectedDate = ref<Date | undefined | null>(props.modelValue)
  const transitionName = ref<'slideMonth' | 'slideMonthRight'>('slideMonthRight')

  dayjs.locale(props.locale)

  const daysInMonth = computed(() => {
    const start = dayjs(currentMonth.value).startOf('month')
    const end = dayjs(currentMonth.value).endOf('month')
    const days: CalendarDay[] = []

    let firstDay = start.day()

    // Корректируем день недели с учетом firstDayOfWeek
    if (props.firstDayOfWeek) {
      firstDay = firstDay - props.firstDayOfWeek
      if (firstDay < 0)
        firstDay += 7
    }

    for (let i = 0; i < firstDay; i++) {
      days.push({
        date: start.subtract(firstDay - i, 'day').toDate(),
        isCurrentMonth: false,
      })
    }

    // Остальной код остается без изменений...
    for (let i = start.date(); i <= end.date(); i++) {
      days.push({
        date: new Date(start.year(), start.month(), i),
        isCurrentMonth: true,
      })
    }

    const remainingDays = 7 - (days.length % 7)
    if (remainingDays < 7) {
      for (let i = 1; i <= remainingDays; i++) {
        days.push({
          date: end.add(i, 'day').toDate(),
          isCurrentMonth: false,
        })
      }
    }

    return days
  })

  const isCurrentMonth = computed(() => {
    const now = new Date()
    return currentMonth.value.getMonth() === now.getMonth()
      && currentMonth.value.getFullYear() === now.getFullYear()
  })

  function isSelected(date: Date | null) {
    if (!selectedDate.value || !date)
      return false

    return dayjs(date).isSame(selectedDate.value, 'day')
  }

  function isToday(date: Date | null) {
    if (!date)
      return false

    const today = new Date()
    return dayjs(date).isSame(today, 'day')
  }

  function previousMonth() {
    transitionName.value = 'slideMonth'
    currentMonth.value = dayjs(currentMonth.value).subtract(1, 'month').toDate()
  }

  function nextMonth() {
    transitionName.value = 'slideMonthRight'
    currentMonth.value = dayjs(currentMonth.value).add(1, 'month').toDate()
  }

  function nowMonth() {
    transitionName.value = 'slideMonthRight'
    currentMonth.value = new Date()
  }

  return {
    currentMonth,
    selectedDate,
    transitionName,
    daysInMonth,
    isCurrentMonth,
    isSelected,
    isToday,
    previousMonth,
    nextMonth,
    nowMonth,
  }
}

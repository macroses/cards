<script setup lang="ts">
import dayjs from 'dayjs'
import 'dayjs/locale/ru'
import 'dayjs/locale/en'

interface CalendarProps {
  modelValue: Date
  locale?: string
  month?: Date
  firstDayOfWeek?: 0 | 1 | 2 | 3 | 4 | 5 | 6
  disabled?: (date: Date) => boolean
}

const props = withDefaults(defineProps<CalendarProps>(), {
  locale: 'en',
  firstDayOfWeek: 1,
})

const emit = defineEmits(['update:modelValue'])

const currentMonth = ref(props.month || new Date())
const selectedDate = ref<Date | undefined | null>(props.modelValue)
const transitionName = ref<'slideMonth' | 'slideMonthRight'>('slideMonthRight')

dayjs.locale(props.locale)

const daysInMonth = computed(() => {
  const start = dayjs(currentMonth.value).startOf('month')
  const end = dayjs(currentMonth.value).endOf('month')
  const days = []

  for (let i = 0; i < start.day(); i++) {
    days.push({
      date: start.subtract(start.day() - i, 'day').toDate(),
      isCurrentMonth: false,
    })
  }

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
  if (!selectedDate.value || !date) {
    return false
  }

  return dayjs(date).isSame(selectedDate.value, 'day')
}

function selectDate(date: Date | null) {
  selectedDate.value = date
  emit('update:modelValue', date)
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

function isToday(date: Date | null) {
  if (!date) {
    return false
  }

  const today = new Date()
  return dayjs(date).isSame(today, 'day')
}

watch(() => props.modelValue, (newValue) => {
  selectedDate.value = newValue
})
</script>

<template>
  <div class="calendar">
    <div class="calendar-header">
      <TheButton
        variant="ghost"
        icon-only
        @click="previousMonth"
      >
        <TheIcon
          icon-name="angle-left"
          width="20px"
          aria-label="previous month"
        />
      </TheButton>
      <TheButton
        variant="ghost"
        icon-only
        @click="nextMonth"
      >
        <TheIcon
          icon-name="angle-right"
          width="20px"
          aria-label="previous month"
        />
      </TheButton>
      <TheButton
        variant="ghost"
        icon-only
        :disabled="isCurrentMonth"
        @click="nowMonth"
      >
        <TheIcon
          icon-name="arrow-rotate-left"
          width="18px"
          aria-label="current month"
        />
      </TheButton>

      <Transition
        mode="out-in"
        :name="transitionName"
      >
        <span
          :key="currentMonth"
          class="calendar-month"
        >
          {{ dayjs(currentMonth).format('MMMM YYYY') }}
        </span>
      </Transition>
    </div>
    <Transition
      mode="out-in"
      :name="transitionName"
    >
      <div
        :key="new Date()"
        class="calendar-days"
      >
        <button
          v-for="(day, index) in daysInMonth"
          :key="index"
          class="calendar-day"
          :class="{
            'selected': isSelected(day.date),
            'today': isToday(day.date),
            'other-month': !day.isCurrentMonth,
          }"
          @click="selectDate(day.date)"
        >
          <span class="calendar-day__text">
            {{ day.date ? dayjs(day.date).format('D') : '' }}
          </span>
        </button>
      </div>
    </Transition>
  </div>
</template>

<style src="./style.css" />

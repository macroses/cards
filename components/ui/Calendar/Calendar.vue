<script setup lang="ts">
import dayjs from 'dayjs'
import type CalendarProps from '~/components/ui/Calendar/calendarTypes'
import { useCalendar } from '~/composables/calendar/useCalendar'

const props = withDefaults(defineProps<CalendarProps>(), {
  locale: 'en',
  firstDayOfWeek: 1,
})

const modelValue = defineModel<Date | null>({ default: new Date() })

const {
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
} = useCalendar({ ...props, modelValue: modelValue.value })

function selectDate(date: Date | null) {
  selectedDate.value = date
  modelValue.value = date
}

watch(() => props.modelValue, (newValue: Date) => {
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
        :key="currentMonth"
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

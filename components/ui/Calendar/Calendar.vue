<script setup lang="ts">
import type { CalendarProps } from '~/ts/componentProps/Calendar.prop'
import dayjs from 'dayjs'

const props = withDefaults(defineProps<CalendarProps>(), {
  locale: 'en',
  firstDayOfWeek: 1,
  copyMode: false,
  dateChangeMode: false,
  workouts: null,
  modelValue: null,
})

const emit = defineEmits<{
  'update:modelValue': [date: Date | null]
  'dateSelect': [date: Date]
}>()

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
  if ((props.copyMode || props.dateChangeMode) && date) {
    emit('dateSelect', date)
    return
  }

  selectedDate.value = date
  emit('update:modelValue', date)
}

function getWorkoutForDate(date: Date) {
  return props.workouts?.find(workout =>
    dayjs(workout.workoutDate).format('YYYY-MM-DD') === dayjs(date).format('YYYY-MM-DD'),
  )
}

watch(() => props.modelValue, (newValue: Date | null) => {
  selectedDate.value = newValue
})

const isRunningWorkout = computed(() => (date: Date) => {
  const workout = getWorkoutForDate(date)
  return workout?.startedAt && !workout?.endedAt
})

const isWorkoutCompleted = computed(() => (date: Date) => {
  const workout = getWorkoutForDate(date)
  return workout?.completed
})

const touchStartX = shallowRef(0)

function onTouchStart(event: TouchEvent) {
  touchStartX.value = event.touches[0].clientX
}

function onTouchEnd(event: TouchEvent) {
  const touchEndX = event.changedTouches[0].clientX
  const diffX = touchStartX.value - touchEndX

  const minSwipeDistance = 50

  if (Math.abs(diffX) > minSwipeDistance) {
    if (diffX > 0) {
      nextMonth()
    }
    else {
      previousMonth()
    }
  }
}
</script>

<template>
  <div
    v-auto-animate="{ duration: 300 }"
    class="calendar"
    :class="{
      'copy-mode': copyMode,
      'date-change-mode': dateChangeMode,
    }"
    @touchstart.passive="onTouchStart"
    @touchend="onTouchEnd"
  >
    <div class="calendar-header">
      <TheButton
        variant="ghost"
        icon-only
        @click="previousMonth"
      >
        <TheIcon
          icon-name="angle-left"
          width="20"
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
          width="20"
          aria-label="previous month"
        />
      </TheButton>
      <div v-auto-animate="{ duration: 300 }" class="current-month">
        <TheButton
          v-if="!isCurrentMonth"
          variant="ghost"
          icon-only
          class="button--current-month"
          :disabled="isCurrentMonth"
          @click="nowMonth"
        >
          <TheIcon
            icon-name="arrow-rotate-left"
            width="18"
            aria-label="current month"
          />
        </TheButton>
      </div>

      <Transition
        mode="out-in"
        :name="transitionName"
      >
        <span
          :key="dayjs(currentMonth).format('YYYY-MM')"
          class="calendar-month"
        >
          {{ dayjs(currentMonth).format('MMMM YYYY') }}
        </span>
      </Transition>
    </div>
    <div
      :key="dayjs(currentMonth).format('YYYY-MM')"
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
          'running-workout': isRunningWorkout(day.date),
          'completed': isWorkoutCompleted(day.date),
        }"
        @click="selectDate(day.date)"
      >
        <span class="calendar-day__text">
          {{ day.date ? dayjs(day.date).format('D') : '' }}
        </span>
        <span
          v-if="getWorkoutForDate(day.date)"
          class="workout-dot"
          :style="{ backgroundColor: `rgb(${getWorkoutForDate(day.date)?.color})` }"
        />
      </button>
    </div>
  </div>
</template>

<style src="./style.css" />

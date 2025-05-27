import type { WorkoutResponse } from '~/ts'

export interface CalendarProps {
  modelValue: Date | null
  locale?: string
  firstDayOfWeek?: 0 | 1
  workouts?: WorkoutResponse[] | null
  copyMode?: boolean
  dateChangeMode?: boolean
}

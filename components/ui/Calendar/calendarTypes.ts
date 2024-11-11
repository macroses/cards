import type { GetWorkoutsResponse } from '~/types/GetWorkoutsResponse'

export default interface CalendarProps {
  modelValue: Date | null
  locale?: string
  firstDayOfWeek?: 0 | 1
  workouts?: GetWorkoutsResponse[] | null
  copyMode?: boolean
}

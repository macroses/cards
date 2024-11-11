import type { IWorkout } from '~/types/GetWorkoutsResponse'

export default interface CalendarProps {
  modelValue: Date | null
  locale?: string
  firstDayOfWeek?: 0 | 1
  workouts?: IWorkout[] | null
  copyMode?: boolean
}

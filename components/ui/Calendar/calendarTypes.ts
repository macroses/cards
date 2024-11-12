import type { CreateWorkoutResponse } from '~/ts/interfaces/createWorkout.interface'

export default interface CalendarProps {
  modelValue: Date | null
  locale?: string
  firstDayOfWeek?: 0 | 1
  workouts?: CreateWorkoutResponse[] | null
  copyMode?: boolean
  dateChangeMode?: boolean
}

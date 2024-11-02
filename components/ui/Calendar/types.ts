export default interface CalendarProps {
  modelValue: Date
  locale?: string
  month?: Date
  firstDayOfWeek?: 0 | 1
  disabled?: (date: Date) => boolean
}

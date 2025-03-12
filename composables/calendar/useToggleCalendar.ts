import { useToggle } from '@vueuse/core'
import { GLOBAL_DATE } from '~/constants'

export function useToggleCalendar() {
  const selectedDate = useState<Date>(GLOBAL_DATE, () => new Date())
  const [isCalendarVisible, toggleCalendar] = useToggle(false)

  watch(selectedDate, () => {
    isCalendarVisible.value = false
  })

  return {
    isCalendarVisible,
    toggleCalendar,
    selectedDate,
  }
}

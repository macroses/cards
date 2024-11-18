export function useToggleCalendar() {
  const selectedDate = useState<Date>('selectedWorkoutDate', () => new Date())
  const isCalendarVisible = shallowRef(false)

  function toggleCalendar() {
    isCalendarVisible.value = !isCalendarVisible.value
  }

  watch(selectedDate, () => {
    isCalendarVisible.value = false
  })

  return {
    isCalendarVisible,
    toggleCalendar,
    selectedDate,
  }
}

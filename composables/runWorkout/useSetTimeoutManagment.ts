import type { UserTrainingSession } from '~/ts/interfaces'

export function useSetTimeManagement() {
  const setTimes = ref<Record<string, number>>({})
  const lastSetTime = ref<number | null>(null)
  const { updateSetTime } = useSetTime()
  const { activeWorkout } = useWorkoutTimer()

  function formatSetTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes} : ${remainingSeconds.toString().padStart(2, '0')}`
  }

  async function handleSetTime(setId: string) {
    if (!activeWorkout.value?.startedAt) {
      return
    }

    const currentTimeInSeconds = Math.floor((Date.now() - new Date(activeWorkout.value.startedAt).getTime()) / 1000)

    let secondsFromPrevious: number
    if (!lastSetTime.value) {
      secondsFromPrevious = currentTimeInSeconds
    }
    else {
      secondsFromPrevious = currentTimeInSeconds - lastSetTime.value
    }

    setTimes.value[setId] = secondsFromPrevious
    await updateSetTime(setId, secondsFromPrevious)
    lastSetTime.value = currentTimeInSeconds
  }

  function initSetTimes(sets: UserTrainingSession[]) {
    if (!sets?.length) {
      return
    }

    // Сбрасываем существующие значения
    setTimes.value = {}
    lastSetTime.value = null

    // Инициализируем времена для всех сетов с учетом данных из localStorage
    const { localWorkout } = useLocalWorkout()

    sets.forEach((set) => {
      // Проверяем наличие времени в localStorage
      const localSet = localWorkout.value?.sets.find(s => s.id === set.id)
      if (localSet?.setTime) {
        setTimes.value[set.id] = localSet.setTime
      }
      else if (set.setTime) {
        setTimes.value[set.id] = set.setTime
      }
    })

    // Находим последний сет с временем
    const setsWithTime = sets
      .filter(set => setTimes.value[set.id] && set.setTimeAddedAt)
      .sort((a, b) => {
        if (!a.setTimeAddedAt || !b.setTimeAddedAt) {
          return 0
        }
        return new Date(b.setTimeAddedAt).getTime() - new Date(a.setTimeAddedAt).getTime()
      })

    // Устанавливаем lastSetTime
    const lastSetWithTime = setsWithTime[0]
    if (lastSetWithTime) {
      let totalTime = 0
      for (const set of sets) {
        if (setTimes.value[set.id]) {
          totalTime += setTimes.value[set.id]
          if (set.id === lastSetWithTime.id) {
            break
          }
        }
      }
      lastSetTime.value = totalTime
    }
  }

  return {
    setTimes,
    formatSetTime,
    handleSetTime,
    initSetTimes,
  }
}

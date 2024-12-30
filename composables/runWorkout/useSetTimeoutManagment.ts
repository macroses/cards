import type { UserTrainingSession } from '~/ts/interfaces'

export function useSetTimeManagement() {
  const setTimes = ref<Record<string, number>>({})
  const lastSetTime = ref<number | null>(null)
  const { updateSetTime } = useSetTime()
  const { activeWorkout } = useWorkoutTimer()

  function formatSetTime(timestamp: number): string {
    if (!activeWorkout.value?.startedAt) {
      return ''
    }

    const sortedSetTimes = Object.entries(setTimes.value)
      .sort(([, a], [, b]) => a - b)
      .map(([id, time]) => ({ id, time }))

    const currentSetIndex = sortedSetTimes.findIndex(set => set.time === timestamp)
    const previousSet = currentSetIndex > 0 ? sortedSetTimes[currentSetIndex - 1] : null

    const startTime = previousSet
      ? previousSet.time
      : new Date(activeWorkout.value.startedAt).getTime()

    const timeDiff = timestamp - startTime
    const minutes = Math.floor(timeDiff / 60000)
    const seconds = Math.floor((timeDiff % 60000) / 1000)

    return `${minutes} : ${seconds.toString().padStart(2, '0')}`
  }

  async function handleSetTime(setId: string) {
    const currentTime = Date.now()

    if (!lastSetTime.value && activeWorkout.value?.startedAt) {
      setTimes.value[setId] = currentTime
      await updateSetTime(setId, currentTime)
    }
    else if (lastSetTime.value) {
      setTimes.value[setId] = currentTime
      await updateSetTime(setId, currentTime)
    }

    lastSetTime.value = currentTime
  }

  async function initSetTimes(sets: UserTrainingSession[]) {
    if (!sets) {
      return
    }

    sets.forEach((set) => {
      if (set.setTime) {
        const timestamp = new Date(set.setTime).getTime()
        setTimes.value[set.id] = timestamp
      }
    })
  }

  return {
    setTimes,
    formatSetTime,
    handleSetTime,
    initSetTimes,
  }
}

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
    if (!activeWorkout.value?.startedAt) return

    const currentTimeInSeconds = Math.floor((Date.now() - new Date(activeWorkout.value.startedAt).getTime()) / 1000)
    
    let secondsFromPrevious: number
    if (!lastSetTime.value) {
      secondsFromPrevious = currentTimeInSeconds
    } else {
      secondsFromPrevious = currentTimeInSeconds - lastSetTime.value
    }

    setTimes.value[setId] = secondsFromPrevious
    await updateSetTime(setId, secondsFromPrevious)
    lastSetTime.value = currentTimeInSeconds
  }

  function initSetTimes(sets: UserTrainingSession[]) {
    if (!sets) return

    sets.forEach((set) => {
      if (set.setTime) {
        setTimes.value[set.id] = set.setTime
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

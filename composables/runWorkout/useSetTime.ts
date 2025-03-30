import { ToastStatusesEnum } from '~/ts/enums/toastStatuses.enum'

export function useSetTime() {
  const { t } = useI18n()
  const { toast } = useToastState()
  const isLoading = ref(false)
  const { updateSet, localWorkout } = useLocalWorkout()

  function updateSetTime(setId: string, timestamp: number) {
    try {
      isLoading.value = true

      if (!localWorkout.value) {
        throw new Error('No workout data found')
      }

      updateSet({
        id: setId,
        setTime: timestamp,
        setTimeAddedAt: new Date().toISOString(),
      } as any)

      return true
    }
    catch (error: unknown) {
      console.error('Error updating set time:', error)
      toast(t('toast.set_time_update_error'), ToastStatusesEnum.ERROR)
      return false
    }
    finally {
      isLoading.value = false
    }
  }

  return {
    updateSetTime,
    isLoading,
  }
}

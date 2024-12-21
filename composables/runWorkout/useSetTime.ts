import { API_UPDATE_SET_TIME } from '~/constants'
import { ToastStatusesEnum } from '~/ts/enums/toastStatuses.enum'

export function useSetTime() {
  const { t } = useI18n()
  const { toast } = useToastState()
  const isLoading = ref(false)

  async function updateSetTime(setId: string, timestamp: number) {
    try {
      isLoading.value = true

      await $fetch(API_UPDATE_SET_TIME, {
        method: 'PUT',
        body: {
          setId,
          timestamp,
        },
      })

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

import { ToastStatusesEnum } from '~/ts/enums/toastStatuses.enum'
import type { UserTrainingSession } from '~/ts/interfaces'

export function useUpdateSet() {
  const { t } = useI18n()
  const { toast } = useToastState()
  const isLoading = ref(false)

  async function updateSets(sets: Partial<UserTrainingSession>[]) {
    try {
      isLoading.value = true

      await $fetch('/api/workout/updateSets', {
        method: 'PUT',
        body: { sets },
      })

      return true
    }
    catch (error: unknown) {
      console.error('Error updating sets:', error)
      toast(t('toast.sets_update_error'), ToastStatusesEnum.ERROR)
      return false
    }
    finally {
      isLoading.value = false
    }
  }

  return {
    updateSets,
    isLoading,
  }
}

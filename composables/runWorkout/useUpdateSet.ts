import { API_CREATE_SET, API_UPDATE_SETS } from '~/constants'
import { ToastStatusesEnum } from '~/ts/enums/toastStatuses.enum'
import type { CreateWorkoutResponse, UserTrainingSession } from '~/ts/interfaces'

export function useUpdateSet() {
  const { t } = useI18n()
  const { toast } = useToastState()
  const isLoading = ref(false)

  async function updateSets(sets: Partial<UserTrainingSession>[]) {
    try {
      isLoading.value = true

      await $fetch(API_UPDATE_SETS, {
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

  async function addNewSet(exerciseId: string, runWorkout: CreateWorkoutResponse | null | undefined) {
    if (runWorkout) {
      try {
        const newSet = await $fetch(API_CREATE_SET, {
          method: 'POST',
          body: {
            workoutId: runWorkout.id,
            exerciseId,
            weight: 0,
            repeats: 0,
            difficulty: 1,
          },
        })

        runWorkout.sets.push(newSet)
      }
      catch (error) {
        console.error('Error creating set:', error)
        toast(t('toast.set_create_error'), ToastStatusesEnum.ERROR)
      }
    }
  }

  return {
    updateSets,
    addNewSet,
    isLoading,
  }
}

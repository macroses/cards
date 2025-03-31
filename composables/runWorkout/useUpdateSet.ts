import type { CreateWorkoutResponse } from '~/ts/interfaces'
import { API_CREATE_SET } from '~/constants'
import { ToastStatusesEnum } from '~/ts/enums/toastStatuses.enum'
import { useWorkoutCache } from './useWorkoutCache'

export function useUpdateSet() {
  const { t } = useI18n()
  const { toast } = useToastState()
  const isLoading = ref(false)
  const { saveWorkout } = useWorkoutCache()

  async function updateSets(sets: CreateWorkoutResponse['sets'], workout: CreateWorkoutResponse) {
    try {
      isLoading.value = true
      workout.sets = sets
      await saveWorkout(workout)
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
        await saveWorkout(runWorkout)
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

import { ToastStatusesEnum } from '~/ts/enums/toastStatuses.enum'
import { useWorkoutCache } from './useWorkoutCache'

export function useSetWeightAndRepeats() {
  const { t } = useI18n()
  const { toast } = useToastState()
  const isLoading = ref(false)
  const {
    getWorkout: getCachedWorkout,
    saveWorkout: saveToCache,
  } = useWorkoutCache()

  async function updateSetWeightAndRepeats(setId: string, weight: number, repeats: number) {
    try {
      isLoading.value = true

      const workout = await getCachedWorkout()

      if (!workout) {
        throw new Error('Workout not found in cache')
      }

      // Обновляем вес и повторения сета
      const set = workout.sets.find(s => s.id === setId)

      if (!set) {
        throw new Error('Set not found')
      }

      set.weight = weight
      set.repeats = repeats

      await saveToCache(workout)

      return true
    }
    catch (error: unknown) {
      console.error('Error updating set weight and repeats:', error)
      toast(t('toast.set_update_error'), ToastStatusesEnum.ERROR)
      return false
    }
    finally {
      isLoading.value = false
    }
  }

  return {
    updateSetWeightAndRepeats,
    isLoading,
  }
}

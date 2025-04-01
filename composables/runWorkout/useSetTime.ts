import { ToastStatusesEnum } from '~/ts/enums/toastStatuses.enum'
import { useWorkoutCache } from './useWorkoutCache'

export function useSetTime() {
  const { t } = useI18n()
  const { toast } = useToastState()
  const isLoading = ref(false)
  const { getWorkout: getCachedWorkout, saveWorkout: saveToCache } = useWorkoutCache()

  async function updateSetTime(setId: string, timestamp: number) {
    try {
      isLoading.value = true

      // Получаем текущую тренировку из кэша
      const workout = await getCachedWorkout()
      if (!workout) {
        throw new Error('Workout not found in cache')
      }

      // Обновляем время сета
      const set = workout.sets.find(s => s.id === setId)
      if (!set) {
        throw new Error('Set not found')
      }
      set.setTime = timestamp

      // Сохраняем обновленную тренировку обратно в кэш
      await saveToCache(workout)

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

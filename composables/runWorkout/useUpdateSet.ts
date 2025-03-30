import type {
  CreateWorkoutResponse,
  UserTrainingSession,
  WorkoutSet,
} from '~/ts/interfaces'
import { useLocalWorkout } from '~/composables/runWorkout/useLocalWorkout'
import { ToastStatusesEnum } from '~/ts/enums/toastStatuses.enum'

export function useUpdateSet() {
  const { t } = useI18n()
  const { toast } = useToastState()
  const isLoading = ref(false)
  const { updateSet, addSet } = useLocalWorkout()

  function updateSets(sets: Partial<UserTrainingSession>[]) {
    try {
      sets.forEach((set: Partial<UserTrainingSession>) => {
        if (set.id) {
          updateSet(set as WorkoutSet)
        }
      })
      return true
    }
    catch (error: unknown) {
      console.error('Error updating sets:', error)
      toast(t('toast.sets_update_error'), ToastStatusesEnum.ERROR)
      return false
    }
  }

  async function addNewSet(exerciseId: string, runWorkout: CreateWorkoutResponse | null | undefined) {
    if (runWorkout) {
      try {
        const newSet = {
          id: crypto.randomUUID(),
          workoutId: runWorkout.id,
          exerciseId,
          weight: 0,
          repeats: 0,
          difficulty: 1,
          completed: false,
          setTime: null,
          setTimeAddedAt: null,
        }

        addSet(newSet)
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

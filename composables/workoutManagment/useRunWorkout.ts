import type { CreateWorkoutResponse, RunWorkoutReturn } from '~/ts/interfaces'
import { API_GET_WORKOUT, GLOBAL_WORKOUTS } from '~/constants'
import { useWorkoutCache } from '../runWorkout/useWorkoutCache'

export function useRunWorkout(): RunWorkoutReturn {
  const route = useRoute()
  const workoutsList = useState<CreateWorkoutResponse[]>(GLOBAL_WORKOUTS, () => [])
  const workoutRunId = ref<string | null>(null)
  const originalWorkout = shallowRef<CreateWorkoutResponse | null>(null)
  const isLoading = ref(false)
  const { getWorkout: getCachedWorkout, saveWorkout: saveToCache } = useWorkoutCache()

  const runWorkout = computed(() => {
    if (!workoutRunId.value || !workoutsList.value) {
      return null
    }

    return workoutsList.value.find(workout => workout.id === workoutRunId.value) ?? null
  })

  const mergeWorkoutData = (
    apiWorkout: CreateWorkoutResponse,
    cachedWorkout: CreateWorkoutResponse | null,
  ): CreateWorkoutResponse => {
    if (!cachedWorkout || cachedWorkout?.id !== apiWorkout.id) {
      return apiWorkout
    }

    return {
      ...apiWorkout,
      sets: apiWorkout.sets.map((apiSet) => {
        const cachedSet = cachedWorkout.sets.find(cs => cs.id === apiSet.id)

        if (!cachedSet) {
          return apiSet
        }

        return {
          ...apiSet,
          weight: cachedSet.weight ?? apiSet.weight,
          repeats: cachedSet.repeats ?? apiSet.repeats,
          setTime: cachedSet.setTime ?? apiSet.setTime,
          completed: cachedSet.completed ?? apiSet.completed,
          setTimeAddedAt: cachedSet.setTimeAddedAt ?? apiSet.setTimeAddedAt,
        }
      }),
    }
  }

  async function fetchWorkout(id: string) {
    try {
      isLoading.value = true
      const cachedWorkout = await getCachedWorkout()
      const apiWorkout = await $fetch<CreateWorkoutResponse>(API_GET_WORKOUT, { query: { id } })

      if (!originalWorkout.value) {
        originalWorkout.value = JSON.parse(JSON.stringify(apiWorkout))
      }

      const mergedWorkout = mergeWorkoutData(apiWorkout, cachedWorkout)

      if (!workoutsList.value) {
        workoutsList.value = []
      }

      const index = workoutsList.value.findIndex(w => w.id === mergedWorkout.id)
      workoutsList.value[index !== -1 ? index : workoutsList.value.length] = mergedWorkout

      if (!cachedWorkout || cachedWorkout.id !== id) {
        await saveToCache(mergedWorkout)
      }

      return mergedWorkout
    }
    catch (error: any) {
      throw showError({
        statusCode: error.statusCode || 404,
        message: error.message || 'Тренировка не найдена',
      })
    }
    finally {
      isLoading.value = false
    }
  }

  async function initRunMode() {
    workoutRunId.value = route.params.id as string
    if (workoutRunId.value) {
      await fetchWorkout(workoutRunId.value)
    }
  }

  return {
    runWorkout,
    originalWorkout,
    initRunMode,
    isLoading,
  }
}

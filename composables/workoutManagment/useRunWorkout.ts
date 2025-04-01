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

  function ensureWorkoutsList() {
    if (!Array.isArray(workoutsList.value)) {
      workoutsList.value = []
    }
  }

  const runWorkout = computed(() => {
    if (!workoutRunId.value) {
      return null
    }

    ensureWorkoutsList()

    return workoutsList.value.find((workout: CreateWorkoutResponse) => workout.id === workoutRunId.value)
  })

  async function fetchWorkout(id: string) {
    try {
      isLoading.value = true

      ensureWorkoutsList()

      const cachedWorkout = await getCachedWorkout()

      // Получаем свежие данные из API
      const apiWorkout = await $fetch<CreateWorkoutResponse>(API_GET_WORKOUT, {
        query: { id },
      })

      // Сохраняем оригинальную версию сразу после получения из API
      if (!originalWorkout.value) {
        originalWorkout.value = JSON.parse(JSON.stringify(apiWorkout))
      }

      // Обновляем только определенные поля из кеша, если они есть
      if (cachedWorkout?.id === id) {
        apiWorkout.sets = apiWorkout.sets.map((apiSet) => {
          const cachedSet = cachedWorkout.sets.find(cs => cs.id === apiSet.id)

          if (cachedSet) {
            // Обновляем только поля, которые могут быть изменены пользователем
            return {
              ...apiSet,
              weight: cachedSet.weight ?? apiSet.weight,
              repeats: cachedSet.repeats ?? apiSet.repeats,
              setTime: cachedSet.setTime ?? apiSet.setTime,
              completed: cachedSet.completed ?? apiSet.completed,
              setTimeAddedAt: cachedSet.setTimeAddedAt ?? apiSet.setTimeAddedAt,
            }
          }
          return apiSet
        })
      }

      // Обновляем список тренировок
      const index = workoutsList.value.findIndex(w => w.id === apiWorkout.id)

      if (index !== -1) {
        workoutsList.value[index] = apiWorkout
      }

      else {
        workoutsList.value.push(apiWorkout)
      }

      // Обновляем кеш только если это необходимо
      if (!cachedWorkout || cachedWorkout.id !== id) {
        await saveToCache(apiWorkout)
      }

      return apiWorkout
    }
    catch (error: any) {
      console.error('Error fetching workout:', error)
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

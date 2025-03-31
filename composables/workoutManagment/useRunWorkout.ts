import type { CreateWorkoutResponse, RunWorkoutReturn } from '~/ts/interfaces'
import { API_GET_WORKOUT, GLOBAL_WORKOUTS } from '~/constants'
import { useWorkoutCache } from '../runWorkout/useWorkoutCache'

export function useRunWorkout(): RunWorkoutReturn {
  const route = useRoute()
  const workoutsList = useState<CreateWorkoutResponse[]>(GLOBAL_WORKOUTS)
  const workoutRunId = ref<string | null>(null)
  const originalWorkout = shallowRef<CreateWorkoutResponse | null>(null)
  const isLoading = ref(false)
  const { getWorkout: getCachedWorkout, saveWorkout: saveToCache } = useWorkoutCache()

  const runWorkout = computed(() => {
    if (!workoutRunId.value) {
      return null
    }

    return workoutsList.value?.find((workout: CreateWorkoutResponse) => workout.id === workoutRunId.value)
  })

  async function fetchWorkout(id: string) {
    try {
      isLoading.value = true

      // Проверяем кэш
      const cachedWorkout = await getCachedWorkout()
      if (cachedWorkout && cachedWorkout.id === id) {
        if (workoutsList.value) {
          const index = workoutsList.value.findIndex(w => w.id === cachedWorkout.id)
          if (index !== -1) {
            workoutsList.value[index] = cachedWorkout
          }
          else {
            workoutsList.value.push(cachedWorkout)
          }
        }
        else {
          workoutsList.value = [cachedWorkout]
        }
        return cachedWorkout
      }

      // Если в кэше нет, значит это первый старт тренировки
      // Делаем запрос к серверу только в этом случае
      const workout = await $fetch<CreateWorkoutResponse>(API_GET_WORKOUT, {
        query: { id },
      })

      if (workoutsList.value) {
        const index = workoutsList.value.findIndex(w => w.id === workout.id)
        if (index !== -1) {
          workoutsList.value[index] = workout
        }
        else {
          workoutsList.value.push(workout)
        }
      }
      else {
        workoutsList.value = [workout]
      }

      if (!originalWorkout.value) {
        originalWorkout.value = JSON.parse(JSON.stringify(workout))
      }

      // Сохраняем в кэш для последующих перезагрузок
      await saveToCache(workout)

      return workout
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

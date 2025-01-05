import { API_GET_WORKOUT, GLOBAL_WORKOUTS } from '~/constants'
import type { CreateWorkoutResponse, RunWorkoutReturn } from '~/ts/interfaces'

export function useRunWorkout(): RunWorkoutReturn {
  const route = useRoute()
  const workoutsList = useState<CreateWorkoutResponse[]>(GLOBAL_WORKOUTS)
  const workoutRunId = ref<string | null>(null)
  const originalWorkout = shallowRef<CreateWorkoutResponse | null>(null)
  const isLoading = ref(false)

  const runWorkout = computed(() => {
    if (!workoutRunId.value) {
      return null
    }

    return workoutsList.value?.find((workout: CreateWorkoutResponse) => workout.id === workoutRunId.value)
  })

  async function fetchWorkout(id: string) {
    try {
      isLoading.value = true

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

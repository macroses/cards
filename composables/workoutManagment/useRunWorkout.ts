import { GLOBAL_WORKOUTS } from '~/constants'
import type { CreateWorkoutResponse } from '~/ts/interfaces'

interface RunWorkoutReturn {
  runWorkout: ComputedRef<CreateWorkoutResponse | null | undefined>
  originalWorkout: Ref<CreateWorkoutResponse | null>
  initRunMode: () => Promise<void>
}

export function useRunWorkout(): RunWorkoutReturn {
  const route = useRoute()
  const workoutsList = useState<CreateWorkoutResponse[] | []>(GLOBAL_WORKOUTS)
  const workoutRunId = ref<string | null>(null)
  const originalWorkout = shallowRef<CreateWorkoutResponse | null>(null)

  const runWorkout = computed(() => {
    if (!workoutRunId.value)
      return null

    return workoutsList.value?.find((workout: CreateWorkoutResponse) => workout.id === workoutRunId.value)
  })

  watch(runWorkout, (workout) => {
    if (workout && !originalWorkout.value) {
      // Создаем копию только при первой инициализации
      originalWorkout.value = JSON.parse(JSON.stringify(workout))
    }
  }, { immediate: true })

  async function initRunMode() {
    workoutRunId.value = route.params.id as string
  }

  return {
    runWorkout,
    originalWorkout,
    initRunMode,
  }
}

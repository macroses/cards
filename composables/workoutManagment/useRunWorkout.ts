import { GLOBAL_WORKOUTS } from '~/constants'
import type { CreateWorkoutResponse } from '~/ts/interfaces'

interface RunWorkoutReturn {
  runWorkout: ComputedRef<CreateWorkoutResponse | null | undefined>
  initRunMode: () => Promise<void>
}

export function useRunWorkout(): RunWorkoutReturn {
  const route = useRoute()
  const workoutsList = useState<CreateWorkoutResponse[] | []>(GLOBAL_WORKOUTS)
  const workoutRunId = ref<string | null>(null)

  const runWorkout = computed(() => {
    if (!workoutRunId.value)
      return null

    return workoutsList.value?.find((workout: CreateWorkoutResponse) => workout.id === workoutRunId.value)
  })

  async function initRunMode() {
    workoutRunId.value = route.params.id as string
  }

  return {
    runWorkout,
    initRunMode,
  }
}

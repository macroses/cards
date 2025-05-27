import type { WorkoutResponse } from '~/ts'

export interface RunWorkoutReturn {
  runWorkout: ComputedRef<WorkoutResponse | null | undefined>
  originalWorkout: Ref<WorkoutResponse | null>
  initRunMode: () => Promise<void>
  isLoading: Ref<boolean>
}

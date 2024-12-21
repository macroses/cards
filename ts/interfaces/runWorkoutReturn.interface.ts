import type { CreateWorkoutResponse } from '~/ts/interfaces/createWorkout.interface'

export interface RunWorkoutReturn {
  runWorkout: ComputedRef<CreateWorkoutResponse | null | undefined>
  originalWorkout: Ref<CreateWorkoutResponse | null>
  initRunMode: () => Promise<void>
  isLoading: Ref<boolean>
}

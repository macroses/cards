import type { UserWorkout } from '~/ts/interfaces/workoutUserTemplate.interface'

export interface CheckWorkoutAccessReturn {
  checkWorkoutAccess: () => Promise<void>
}

export interface SubmitWorkoutReturn {
  submitWorkout: (workout: UserWorkout) => Promise<boolean>
  isLoading: Ref<boolean>
}

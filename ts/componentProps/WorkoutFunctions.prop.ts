import type { CreateWorkoutResponse } from '~/ts/interfaces'

export interface WorkoutFunctionsProps {
  workout: CreateWorkoutResponse
  isCopyMode: boolean
  isDateChangeMode: boolean
}

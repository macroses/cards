import type { CreateWorkoutResponse } from './createWorkout.interface'

export interface EditingState {
  setId: string | null
  field: 'weight' | 'repeats' | null
  set?: CreateWorkoutResponse['sets'][0]
}

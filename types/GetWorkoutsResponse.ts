import type { Exercise } from '~/types/Exercise'

export interface GetWorkoutsResponse {
  id: string
  userId: string
  title: string
  color: string
  workoutDate: Date
  createdAt: Date
  updatedAt: Date
  exercises: Exercise[]
}

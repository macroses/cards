// Request types
export interface CreateWorkoutRequest {
  title: string
  color: string
  workoutDate: Date
  exercises: Array<{
    id: string
    name: string
  }>
  sessions: Array<{
    id: string
    exerciseId: string
    weight: number | null
    repeats: number | null
    difficulty: number
    completed: boolean
    setTime: number | null
  }>
}

export interface CreateWorkoutResponse {
  id: string
  userId: string
  title: string
  color: string
  workoutDate: Date
  createdAt: Date
  updatedAt: Date
  completed: boolean
  startedAt?: Date | null
  endedAt?: Date | null
  exercises: Array<{
    id: string
    exerciseName: string
    workoutId: string
    exerciseId: string
  }>
  sets: Array<{
    id: string
    workoutId: string
    exerciseId: string
    weight: number
    repeats: number
    difficulty: number
    completed: boolean
    setTime: number | null
  }>
}

// Request types
export interface CreateWorkoutRequest {
  title: string
  color: string
  workoutDate: Date
  exercises: {
    id: number
    name: string
  }[]
  sessions: {
    id: string
    exerciseId: number
    weight: number | null
    repeats: number | null
    difficulty: number
  }[]
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
  exercises: {
    id: string
    exerciseName: string
    workoutId: string
    exerciseId: number
  }[]
  sets: {
    id: string
    workoutId: string
    exerciseId: number
    weight: number
    repeats: number
    difficulty: number
  }[]
}

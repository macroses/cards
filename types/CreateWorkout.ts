// Request types
export interface CreateWorkoutRequest {
  title: string
  color: string
  workoutDate: Date
  exercises: {
    exerciseId: number
    sets: {
      weight: number
      repeats: number
      difficulty: number
    }[]
  }[]
}

// Response types
export interface CreateWorkoutResponse {
  id: string
  userId: string
  title: string
  color: string
  workoutDate: Date
  createdAt: Date
  updatedAt: Date
  exercises: {
    id: string
    exerciseId: number
    sets: {
      id: string
      weight: number
      repeats: number
      difficulty: number
    }[]
  }[]
}

// Error responses
export interface ApiError {
  statusCode: number
  message: string
}

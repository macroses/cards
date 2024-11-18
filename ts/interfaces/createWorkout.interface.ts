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

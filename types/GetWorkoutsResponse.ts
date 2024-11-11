export interface IWorkout {
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

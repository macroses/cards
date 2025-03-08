export interface UserExercise {
  id: string
  userId: string
  name: string
  muscles: {
    primary: string
    secondary: string[]
  }
  characteristics: {
    type: string
    category: string
    equipment: string
    force: string
    level: string
  }
  description: string
  createdAt: Date
  updatedAt: Date
}

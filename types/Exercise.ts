export interface Exercise {
  id: number
  name: string
  muscles: {
    muscleId: number
    primary: string
    secondary: string[] | null
  }
  characteristics: {
    type: string
    category: string
    equipment: string
    force: string
    level: string
  }
  description: string
}

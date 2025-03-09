export interface ExerciseServerTemplate {
  id: number
  name: string
  muscleId: number
  primary: string
  secondary: string[] | []
  type: string
  category: string
  equipment: string
  force: string
  level: string
  description: string
}

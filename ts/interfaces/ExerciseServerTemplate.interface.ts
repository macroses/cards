export interface ExerciseServerTemplate {
  id: number
  name: string
  muscles: ExerciseMuscles
  characteristics: ExerciseCharacteristics
  description: string
}

interface ExerciseMuscles {
  muscleId: number
  primary: string
  secondary: string[] | null
}

interface ExerciseCharacteristics {
  type: string
  category: string
  equipment: string
  force: string
  level: string
}

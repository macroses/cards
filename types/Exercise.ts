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

export interface ExerciseData {
  sets: any[] // можно будет уточнить тип позже
  currentWeight: string
  currentRepeats: string
  currentDifficulty: number
}

import type { DIFFICULT_LEVEL } from '~/ts/enums/workoutColors.enum'

export interface ExerciseFormData {
  id: string
  exerciseId: number
  weight: number | null
  repeats: number | null
  difficulty: DIFFICULT_LEVEL
  completed: boolean
}

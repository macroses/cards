import type { DIFFICULT_LEVEL } from '~/ts/enums/workoutColors.enum'

export interface ExerciseFormData {
  id: string
  exerciseId: string
  weight: number | null
  repeats: number | null
  difficulty: DIFFICULT_LEVEL
  completed: boolean
  setTime: string | null
}

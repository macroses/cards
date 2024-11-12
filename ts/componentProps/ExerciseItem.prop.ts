import type { ExerciseServerTemplate } from '~/ts/interfaces/ExerciseServerTemplate.interface'

export interface ExerciseItemProps {
  exercise: ExerciseServerTemplate
  isSelected: boolean
}

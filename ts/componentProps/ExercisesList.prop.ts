import type { ExerciseServerTemplate } from '~/ts/interfaces'

export interface ExercisesListProps {
  selectedExercises: ExerciseServerTemplate[]
  emit: (
    event: 'selectExercise',
    exercise: ExerciseServerTemplate
  ) => void
}

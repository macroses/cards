import type { ExerciseTemplate } from '~/ts'

export interface ExercisesListProps {
  selectedExercises: ExerciseTemplate[]
  emit: (
    event: 'selectExercise',
    exercise: ExerciseTemplate
  ) => void
}

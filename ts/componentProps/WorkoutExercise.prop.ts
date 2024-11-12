import type { ExerciseServerTemplate, UserTrainingSession } from '~/ts/interfaces'

export interface WorkoutExercisesProps {
  exercises: ExerciseServerTemplate[]
  activeExerciseId: number | null
  exerciseData: Map<number, any>
  workoutExercises: {
    exerciseId: number
    sets: UserTrainingSession[]
  }[]
}

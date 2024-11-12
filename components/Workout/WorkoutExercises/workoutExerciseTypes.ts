import type { ExerciseServerTemplate } from '~/ts/interfaces/ExerciseServerTemplate.interface'
import type { WorkoutSet } from '~/ts/interfaces/workoutUserTemplate.interface'

export interface Props {
  exercises: ExerciseServerTemplate[]
  activeExerciseId: number | null
  exerciseData: Map<number, any>
  workoutExercises: {
    exerciseId: number
    sets: WorkoutSet[]
  }[]
}

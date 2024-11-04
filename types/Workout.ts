export interface WorkoutSet {
  id: string
  weight: number
  repeats: number
  difficulty: number
}

export interface WorkoutExercise {
  exerciseId: number
  sets: WorkoutSet[]
}

export default interface Workout {
  title: string
  color: string
  exercises: WorkoutExercise[]
  workoutDate: Date
}

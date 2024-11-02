export default interface Workout {
  title: string
  color: string
  weight?: number | null
  repeats: number | null
  effort: number
  workoutDate: Date
}

import type { ECBasicOption } from 'echarts/types/dist/shared'

export interface ChartData {
  date: Date
  volume: number
  intensity: number
  workoutsCount: number
}

export interface ExerciseData {
  date: Date
  maxWeight: number
  avgWeight: number
  setsCount: number
}

export interface DurationData {
  date: Date
  duration: number
  avgSetTime: number
  workoutsCount: number
}

interface ApiChartData {
  date: string
  volume: number
  intensity: number
  workoutsCount: number
}

interface ApiExerciseData {
  date: string
  maxWeight: number
  avgWeight: number
  setsCount: number
}

interface ApiDurationData {
  date: string
  duration: number
  avgSetTime: number
  workoutsCount: number
}

export interface ChartsApiResponse {
  volumeData: ApiChartData[]
  durationData: ApiDurationData[]
  exerciseData: Record<number, ApiExerciseData[]>
  popularExercises: number[]
}

export interface GlobalChartsReturn {
  charts: ComputedRef<Array<{
    title: string
    option: ECBasicOption | null
    type: 'default' | 'exercise'
  }>>
  selectedExercise: Ref<string | null>
  popularExercises: Ref<string[]>
  getExerciseName: (exerciseId: string) => string
  refresh: () => Promise<void>
}

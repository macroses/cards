import type { ECBasicOption } from 'echarts/types/dist/shared'

export interface ChartData {
  date: Date
  volume: number
  intensity: number
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
}

interface ApiChartData {
  date: string
  volume: number
  intensity: number
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
  selectedExercise: Ref<number | null>
  popularExercises: Ref<number[]>
  getExerciseName: (exerciseId: number) => string
  isLoading: Ref<boolean>
  error: Ref<string | null>
}

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

export interface VolumeDataItem {
  date: Date | string
  volume: number
  intensity: number
  workoutsCount: number
}

export interface DurationDataItem {
  date: Date | string
  duration: number
  avgSetTime: number
  workoutsCount: number
}

export interface ChartsApiResponse {
  volumeData: VolumeDataItem[]
  durationData: DurationDataItem[]
  popularExercises: string[]
  exerciseData: Record<string, ExerciseData[]>
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

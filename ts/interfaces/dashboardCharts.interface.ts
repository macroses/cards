import type { ECBasicOption } from 'echarts/types/dist/shared'

// Интерфейс для графика в коллекции
export interface CollectedChart {
  id: number
  title: string
  option: ECBasicOption | null
  type: 'default' | 'exercise'
}

// Интерфейс для пропсов компонента ChartsCollection
export interface ChartsCollectionProps {
  charts: Array<{
    title: string
    option: ECBasicOption | null
    type: 'default' | 'exercise'
  }>
  selectedExercise: string | null
  popularExercises: string[]
  getExerciseName: (exerciseId: string) => string
  collectedChartIds: number[]
}

// Значения по умолчанию для пропсов
export const defaultChartsCollectionProps = {
  selectedExercise: null,
  popularExercises: [] as string[],
  collectedChartIds: [0],
  isLoading: false,
} as const

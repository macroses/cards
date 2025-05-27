import type { WorkoutResponse } from '~/ts'

export type WorkoutSet = WorkoutResponse['sets'][0]
export type MetricFn = (set: WorkoutSet) => number
export interface Metric {
  name: string
  current: MetricFn
  previous: MetricFn
}
export type Metrics = Record<'weight' | 'repeats' | 'time' | 'volume', Metric>
export type ProgressMetrics = Record<'weight' | 'repeats' | 'time' | 'volume', MetricFn>

export interface WorkoutChartData {
  grid?: {
    top: number
    bottom: number
    left: number
    right: number
    containLabel: boolean
  }
  xAxis: { type: 'category', data: string[] }
  yAxis: { type: 'value', name: string }
  series: unknown[]
  tooltip: unknown
  legend: { show: boolean }
}

export interface MetricProgress {
  current: number
  previous: number
  change: number
  max: {
    current: number
    previous: number
    change: number
  }
}

export interface ProgressData {
  weight: MetricProgress
  repeats: MetricProgress
  time: MetricProgress
  volume: MetricProgress
  previousWorkoutDate: Date
}

export type MetricCharts = Record<keyof Metrics, WorkoutChartData>
export type ChartType = keyof MetricCharts

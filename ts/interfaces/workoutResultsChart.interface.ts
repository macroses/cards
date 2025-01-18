import type { CreateWorkoutResponse } from '~/ts/interfaces/createWorkout.interface'

export type WorkoutSet = CreateWorkoutResponse['sets'][0]
export type MetricFn = (set: WorkoutSet) => number
export interface Metric {
  name: string
  current: MetricFn
  previous: MetricFn
}
export type Metrics = Record<'weight' | 'repeats' | 'time' | 'volume', Metric>
export type ProgressMetrics = Record<'weight' | 'repeats' | 'time' | 'volume', MetricFn>

export interface ChartData {
  xAxis: { type: 'category', data: string[] }
  yAxis: { type: 'value', name: string }
  series: Array<{
    name: string
    data: number[]
    type: 'line'
    smooth: true
    lineStyle: { width: number } | { type: 'dashed', width: number }
  }>
  tooltip: { trigger: 'axis' }
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

export type MetricCharts = Record<keyof Metrics, ChartData>
export type ChartType = keyof MetricCharts

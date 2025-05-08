import type { WorkoutColor } from '~/ts/types/workoutColor.type'
import { DIFFICULT_LEVEL } from '~/ts/enums/workoutColors.enum'

export const WORKOUT_DIFFICULTY = [
  { value: DIFFICULT_LEVEL.WARM, label: '1' },
  { value: DIFFICULT_LEVEL.LOW, label: '2' },
  { value: DIFFICULT_LEVEL.MEDIUM, label: '3' },
  { value: DIFFICULT_LEVEL.HIGH, label: '4' },
  { value: DIFFICULT_LEVEL.MAXIMUM, label: '5' },
] as const

export const WORKOUT_COLORS: WorkoutColor[] = [
  { id: 1, rgb: '213, 0, 0' },
  { id: 2, rgb: '230, 124, 115' },
  { id: 3, rgb: '244, 81, 3' },
  { id: 4, rgb: '246, 191, 38' },
  { id: 5, rgb: '51, 182, 121' },
  { id: 6, rgb: '11, 128, 67' },
  { id: 7, rgb: '3, 155, 229' },
  { id: 8, rgb: '63, 81, 181' },
  { id: 9, rgb: '121, 134, 203' },
  { id: 10, rgb: '142, 36, 170' },
  { id: 11, rgb: '97, 97, 97' },
] as const

export const MAX_LENGTH_NUMBER = 3

export const WORKOUT_LIMITS = {
  MAX_SETS_COUNT: 50,
}

export const WORKOUT_CACHE_KEYS = {
  WORKOUT: 'workout',
}

export const DEFAULT_SET_VALUES = {
  WEIGHT: 0,
  REPEATS: 0,
}

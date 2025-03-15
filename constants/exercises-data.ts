const EXERCISE_CATEGORY = [
  'basic',
  'strength',
  'stretching',
] as const

const EXERCISE_EQUIPMENT = [
  { id: 1, value: 'barbell' },
  { id: 2, value: 'dumbbell' },
  { id: 3, value: 'cable' },
  { id: 4, value: 'machine' },
  { id: 5, value: 'bodyweight' },
] as const

const EXERCISE_FORCE = [
  'pull',
  'push',
  'static',
] as const

const EXERCISE_LEVEL = [
  'beginner',
  'intermediate',
  'advanced',
] as const

export {
  EXERCISE_CATEGORY,
  EXERCISE_EQUIPMENT,
  EXERCISE_FORCE,
  EXERCISE_LEVEL,
}

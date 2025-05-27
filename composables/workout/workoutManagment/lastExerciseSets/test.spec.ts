import type { WorkoutResponse } from '~/ts'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { KEYS } from '~/constants'
import { useLastExerciseSets } from './useLastExerciseSets'

vi.mock('~/constants', () => ({
  KEYS: {
    GLOBAL_WORKOUTS: 'global-workouts',
  },
}))

const mockUseState = vi.fn()
const mockRef = vi.fn(initialValue => ({ value: initialValue }))

vi.mock('#app', () => ({
  useState: mockUseState,
  ref: mockRef,
}))

describe('useLastExerciseSets', () => {
  const mockExerciseId = 'exercise-123'
  const mockCurrentDate = new Date('2023-02-01')

  const mockWorkout1: WorkoutResponse = {
    id: 'workout-1',
    title: 'Workout 1',
    userId: 'user-123',
    workoutDate: new Date('2023-01-01'),
    color: '#ff0000',
    createdAt: new Date(),
    updatedAt: new Date(),
    completed: false,
    exercises: [
      {
        exerciseId: mockExerciseId,
        exerciseName: 'Bench Press',
        workoutId: 'workout-1',
        id: 'ex-1',
      },
    ],
    sets: [
      {
        id: 'set-1',
        exerciseId: mockExerciseId,
        weight: 100,
        repeats: 10,
        difficulty: 3,
        completed: true,
        setTime: 60,
      },
      {
        id: 'set-2',
        exerciseId: mockExerciseId,
        weight: 110,
        repeats: 8,
        difficulty: 4,
        completed: true,
        setTime: 60,
      },
      {
        id: 'set-3',
        exerciseId: 'different-exercise',
        weight: 50,
        repeats: 12,
        difficulty: 2,
        completed: true,
        setTime: 45,
      },
    ],
  }

  const mockWorkout2: WorkoutResponse = {
    id: 'workout-2',
    title: 'Workout 2',
    userId: 'user-123',
    workoutDate: new Date('2023-01-15'),
    color: '#00ff00',
    createdAt: new Date(),
    updatedAt: new Date(),
    completed: false,
    exercises: [
      {
        exerciseId: mockExerciseId,
        exerciseName: 'Bench Press',
        workoutId: 'workout-2',
        id: 'ex-2',
      },
    ],
    sets: [
      {
        id: 'set-4',
        exerciseId: mockExerciseId,
        weight: 120,
        repeats: 6,
        difficulty: 5,
        completed: true,
        setTime: 60,
      },
    ],
  }

  const mockWorkout3: WorkoutResponse = {
    id: 'workout-3',
    title: 'Workout 3',
    userId: 'user-123',
    workoutDate: new Date('2023-02-15'),
    color: '#0000ff',
    createdAt: new Date(),
    updatedAt: new Date(),
    completed: false,
    exercises: [
      {
        exerciseId: mockExerciseId,
        exerciseName: 'Bench Press',
        workoutId: 'workout-3',
        id: 'ex-3',
      },
    ],
    sets: [
      {
        id: 'set-5',
        exerciseId: mockExerciseId,
        weight: 130,
        repeats: 5,
        difficulty: 5,
        completed: true,
        setTime: 60,
      },
    ],
  }

  const mockWorkouts = [mockWorkout1, mockWorkout2, mockWorkout3]

  beforeEach(() => {
    vi.clearAllMocks()

    mockUseState.mockImplementation((key) => {
      if (key === KEYS.GLOBAL_WORKOUTS) {
        return {
          value: mockWorkouts,
        }
      }
      return { value: null }
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('должен инициализироваться с пустым объектом lastSets', () => {
    const { lastSets } = useLastExerciseSets()
    expect(lastSets.value).toEqual({})
  })

  it('должен вернуть пустой массив, если нет предыдущих тренировок с этим упражнением', () => {
    const { getLastSets, lastSets } = useLastExerciseSets()

    getLastSets('non-existent-exercise', mockCurrentDate)

    expect(lastSets.value['non-existent-exercise']).toEqual([])
  })

  it('должен вернуть пустой массив, если нет тренировок до указанной даты', () => {
    const { getLastSets, lastSets } = useLastExerciseSets()
    const earlyDate = new Date('2022-01-01')

    getLastSets(mockExerciseId, earlyDate)

    expect(lastSets.value[mockExerciseId]).toEqual([])
  })

  it('должен вернуть пустой массив, если список тренировок пуст', () => {
    mockUseState.mockImplementation(() => ({ value: [] }))

    const { getLastSets, lastSets } = useLastExerciseSets()

    getLastSets('non-existent-exercise', mockCurrentDate)

    expect(lastSets.value['non-existent-exercise']).toEqual([])

    mockUseState.mockImplementation((key) => {
      if (key === KEYS.GLOBAL_WORKOUTS) {
        return {
          value: mockWorkouts,
        }
      }
      return { value: null }
    })
  })
})

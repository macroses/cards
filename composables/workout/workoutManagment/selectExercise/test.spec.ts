import type { UserWorkout, UserWorkoutExercise } from '~/ts/interfaces'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useSelectExercise } from './useSelectExercise'

const mockGetLastSets = vi.fn()
vi.mock('../lastExerciseSets/useLastExerciseSets', () => {
  return {
    useLastExerciseSets: () => {
      return {
        getLastSets: mockGetLastSets,
      }
    },
  }
})

describe('useSelectExercise', () => {
  const mockExercise: UserWorkoutExercise = {
    id: 'exercise-123',
    name: 'Bench Press',
  }

  const mockWorkout: UserWorkout = {
    title: 'Test Workout',
    color: '#ff0000',
    workoutDate: new Date('2023-01-01'),
    exercises: [],
    sessions: [],
    startedAt: null,
    endedAt: null,
    completed: false,
  }

  beforeEach(() => {
    vi.clearAllMocks()
    mockGetLastSets.mockClear()

    mockWorkout.exercises = []
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('должен добавить упражнение в тренировку, если его там нет', async () => {
    const { selectExercise } = useSelectExercise()

    await selectExercise(mockExercise, mockWorkout)

    expect(mockWorkout.exercises).toContain(mockExercise)
    expect(mockWorkout.exercises).toHaveLength(1)
  })

  it('должен вызвать getLastSets с правильными параметрами после добавления упражнения', async () => {
    const { selectExercise } = useSelectExercise()

    await selectExercise(mockExercise, mockWorkout)

    expect(mockGetLastSets).toHaveBeenCalledWith(mockExercise.id, mockWorkout.workoutDate)
    expect(mockGetLastSets).toHaveBeenCalledTimes(1)
  })

  it('не должен добавлять упражнение повторно, если оно уже есть в тренировке', async () => {
    const { selectExercise } = useSelectExercise()
    mockWorkout.exercises = [mockExercise]

    await selectExercise(mockExercise, mockWorkout)

    expect(mockWorkout.exercises).toHaveLength(1)
    expect(mockGetLastSets).not.toHaveBeenCalled()
  })

  it('должен добавить другое упражнение, даже если в тренировке уже есть упражнения', async () => {
    const { selectExercise } = useSelectExercise()
    const existingExercise = { ...mockExercise, id: 'existing-exercise' }
    mockWorkout.exercises = [existingExercise]

    await selectExercise(mockExercise, mockWorkout)

    expect(mockWorkout.exercises).toHaveLength(2)
    expect(mockWorkout.exercises).toContain(existingExercise)
    expect(mockWorkout.exercises).toContain(mockExercise)
  })

  it('должен корректно обрабатывать добавление нескольких упражнений последовательно', async () => {
    const { selectExercise } = useSelectExercise()
    const exercise1 = { ...mockExercise, id: 'exercise-1' }
    const exercise2 = { ...mockExercise, id: 'exercise-2' }
    const exercise3 = { ...mockExercise, id: 'exercise-3' }

    await selectExercise(exercise1, mockWorkout)
    await selectExercise(exercise2, mockWorkout)
    await selectExercise(exercise3, mockWorkout)

    expect(mockWorkout.exercises).toHaveLength(3)
    expect(mockWorkout.exercises).toContain(exercise1)
    expect(mockWorkout.exercises).toContain(exercise2)
    expect(mockWorkout.exercises).toContain(exercise3)
    expect(mockGetLastSets).toHaveBeenCalledTimes(3)
  })
})

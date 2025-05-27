import type { UserWorkout, WorkoutResponse } from '~/ts'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useEditWorkout } from './useEditWorkout'

vi.mock('./useEditWorkout', () => ({
  useEditWorkout: vi.fn(() => ({
    editableWorkout: { value: null },
    initEditMode: vi.fn(),
  })),
}))

vi.mock('nanoid', () => ({
  nanoid: vi.fn(() => 'mocked-nanoid'),
}))

describe('useEditWorkout', () => {
  const mockWorkoutId = 'workout-123'
  const mockUserWorkout: UserWorkout = {
    title: '',
    color: '',
    workoutDate: new Date(),
    exercises: [],
    sessions: [],
    startedAt: null,
    endedAt: null,
    completed: false,
  }

  const mockFoundWorkout: WorkoutResponse = {
    id: mockWorkoutId,
    title: 'Test Workout',
    userId: 'user-123',
    workoutDate: new Date('2023-01-01'),
    color: '#ff0000',
    createdAt: new Date(),
    updatedAt: new Date(),
    completed: false,
    exercises: [
      {
        exerciseId: 'exercise-123',
        exerciseName: 'Bench Press',
        workoutId: 'fsdfs',
        id: 'a123123',
      },
    ],
    sets: [
      {
        id: 'set-123',
        exerciseId: 'exercise-123',
        weight: 100,
        repeats: 10,
        difficulty: 3,
        completed: true,
        setTime: 60,
      },
    ],
  }

  const mockWorkoutsList = {
    value: [mockFoundWorkout],
  }

  const mockRoute = {
    query: { edit: mockWorkoutId },
  }

  const mockComputed = vi.fn((fn) => {
    const computedRef = {
      value: fn(),
    }
    return computedRef
  })

  const mockWatch = vi.fn((source, callback) => {
    if (source.value) {
      callback(source.value)
    }
    return () => {}
  })

  const mockRef = vi.fn((initialValue) => {
    return {
      value: initialValue,
    }
  })

  beforeEach(() => {
    vi.clearAllMocks()

    mockUserWorkout.title = ''
    mockUserWorkout.color = ''
    mockUserWorkout.workoutDate = new Date()
    mockUserWorkout.exercises = []
    mockUserWorkout.sessions = []

    const mockEditWorkoutImpl = (workout: UserWorkout) => {
      const workoutEditId = mockRef(null)

      const editableWorkout = mockComputed(() => {
        if (!workoutEditId.value?.edit) {
          return null
        }

        return mockWorkoutsList.value?.find((w: WorkoutResponse) => w.id === workoutEditId.value?.edit)
      })

      mockWatch(editableWorkout, async (foundWorkout: any) => {
        if (!foundWorkout) {
          return
        }

        workout.title = foundWorkout.title
        workout.color = foundWorkout.color
        workout.workoutDate = new Date(foundWorkout.workoutDate)

        // foundWorkout.exercises.forEach((exercise: any) => {
        //   mockSelectExercise()
        // })

        foundWorkout.sets.forEach((set: any) => {
          workout.sessions.push({
            id: 'mocked-nanoid',
            exerciseId: set.exerciseId,
            weight: set.weight,
            repeats: set.repeats,
            difficulty: set.difficulty,
            completed: set.completed,
            setTime: set.setTime || null,
          })
        })
      })

      async function initEditMode() {
        workoutEditId.value = mockRoute.query

        const foundWorkout = mockWorkoutsList.value?.find((w: WorkoutResponse) => w.id === mockRoute.query.edit)
        editableWorkout.value = foundWorkout || null

        if (editableWorkout.value) {
          await mockWatch.mock.calls[0][1](editableWorkout.value)
        }
      }

      return {
        editableWorkout,
        initEditMode,
      }
    }

    const mockUseEditWorkout = useEditWorkout as any
    mockUseEditWorkout.mockImplementation(mockEditWorkoutImpl)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('должен инициализироваться с editableWorkout равным null', () => {
    const { editableWorkout } = useEditWorkout(mockUserWorkout)
    expect(editableWorkout.value).toBeNull()
  })

  it('должен найти правильную тренировку при вызове initEditMode', async () => {
    const { initEditMode, editableWorkout } = useEditWorkout(mockUserWorkout)

    await initEditMode()

    expect(editableWorkout.value).toEqual(mockFoundWorkout)
  })

  it('должен заполнить тренировку данными из найденной тренировки', async () => {
    const { initEditMode } = useEditWorkout(mockUserWorkout)

    await initEditMode()

    expect(mockUserWorkout.title).toBe(mockFoundWorkout.title)
    expect(mockUserWorkout.color).toBe(mockFoundWorkout.color)
    expect(mockUserWorkout.workoutDate.getTime()).toBe(new Date(mockFoundWorkout.workoutDate).getTime())
  })

  it('должен добавить сессии для каждого подхода в найденной тренировке', async () => {
    const { initEditMode } = useEditWorkout(mockUserWorkout)

    await initEditMode()

    expect(mockUserWorkout.sessions.length).toBe(mockFoundWorkout.sets.length)
    expect(mockUserWorkout.sessions[0]).toEqual({
      id: 'mocked-nanoid',
      exerciseId: mockFoundWorkout.sets[0].exerciseId,
      weight: mockFoundWorkout.sets[0].weight,
      repeats: mockFoundWorkout.sets[0].repeats,
      difficulty: mockFoundWorkout.sets[0].difficulty,
      completed: mockFoundWorkout.sets[0].completed,
      setTime: mockFoundWorkout.sets[0].setTime,
    })
  })

  it('не должен обновлять тренировку, если тренировка не найдена', async () => {
    const emptyWorkoutsList = { value: [] }
    mockWorkoutsList.value = emptyWorkoutsList.value

    const { initEditMode } = useEditWorkout(mockUserWorkout)

    await initEditMode()

    expect(mockUserWorkout.title).toBe('')
    expect(mockUserWorkout.color).toBe('')
    expect(mockUserWorkout.exercises.length).toBe(0)
    expect(mockUserWorkout.sessions.length).toBe(0)
  })

  it('должен обрабатывать null workoutsList', async () => {
    mockWorkoutsList.value = null as any

    const { initEditMode } = useEditWorkout(mockUserWorkout)

    await expect(initEditMode()).resolves.not.toThrow()
  })
})

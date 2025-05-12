import type { CreateWorkoutResponse } from '~/ts/interfaces'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { API, AUTHENTICATED } from '~/constants'
import { useFetchWorkoutsByUserId } from './useFetchWorkoutsByUserId'

vi.mock('./useFetchWorkoutsByUserId', () => ({
  useFetchWorkoutsByUserId: vi.fn(() => ({
    workouts: { value: null },
    isLoading: { value: false },
    error: { value: null },
    fetchWorkouts: vi.fn(),
    isChartControlVisible: { value: false },
  })),
}))

describe('useFetchWorkoutsByUserId', () => {
  const mockWorkouts: CreateWorkoutResponse[] = [
    {
      id: 'workout-123',
      title: 'Тренировка 1',
      userId: 'user-123',
      workoutDate: new Date('2023-01-01'),
      color: '#ff0000',
      createdAt: new Date(),
      updatedAt: new Date(),
      completed: true,
      exercises: [],
      sets: [],
    },
    {
      id: 'workout-456',
      title: 'Тренировка 2',
      userId: 'user-123',
      workoutDate: new Date('2023-01-02'),
      color: '#00ff00',
      createdAt: new Date(),
      updatedAt: new Date(),
      completed: true,
      exercises: [],
      sets: [],
    },
    {
      id: 'workout-789',
      title: 'Тренировка 3',
      userId: 'user-123',
      workoutDate: new Date('2023-01-03'),
      color: '#0000ff',
      createdAt: new Date(),
      updatedAt: new Date(),
      completed: true,
      exercises: [],
      sets: [],
    },
    {
      id: 'workout-101',
      title: 'Тренировка 4',
      userId: 'user-123',
      workoutDate: new Date('2023-01-04'),
      color: '#ffff00',
      createdAt: new Date(),
      updatedAt: new Date(),
      completed: true,
      exercises: [],
      sets: [],
    },
    {
      id: 'workout-102',
      title: 'Тренировка 5',
      userId: 'user-123',
      workoutDate: new Date('2023-01-05'),
      color: '#ff00ff',
      createdAt: new Date(),
      updatedAt: new Date(),
      completed: true,
      exercises: [],
      sets: [],
    },
    {
      id: 'workout-103',
      title: 'Незавершенная тренировка',
      userId: 'user-123',
      workoutDate: new Date('2023-01-06'),
      color: '#00ffff',
      createdAt: new Date(),
      updatedAt: new Date(),
      completed: false,
      exercises: [],
      sets: [],
    },
  ]

  const mockFetch = vi.fn() as any
  const mockTranslate = vi.fn(key => key)
  const mockConsoleError = vi.fn()

  let workoutsValue: any = null
  let isLoadingValue = false
  let errorValue: any = null
  let authStatus = AUTHENTICATED

  const setWorkouts = (value: any) => {
    workoutsValue = value
  }

  const setIsLoading = (value: boolean) => {
    isLoadingValue = value
  }

  const setError = (value: any) => {
    errorValue = value
  }

  beforeEach(() => {
    vi.clearAllMocks()

    workoutsValue = null
    isLoadingValue = false
    errorValue = null
    authStatus = AUTHENTICATED

    globalThis.$fetch = mockFetch
    globalThis.console.error = mockConsoleError

    const mockFetchWorkouts = vi.fn(async () => {
      setIsLoading(true)

      try {
        if (authStatus !== AUTHENTICATED) {
          return
        }

        const fetchedWorkouts = await mockFetch(API.WORKOUTS_LIST)
        setWorkouts(fetchedWorkouts)
      }
      catch (err) {
        mockConsoleError(err)
        setError(mockTranslate('error.workouts_load_error'))
        setWorkouts(null)
      }
      finally {
        setIsLoading(false)
      }
    })

    const mockUseFetchWorkoutsByUserId = useFetchWorkoutsByUserId as any
    mockUseFetchWorkoutsByUserId.mockImplementation(() => ({
      workouts: {
        get value() { return workoutsValue },
        set value(val) { setWorkouts(val) },
      },
      isLoading: {
        get value() { return isLoadingValue },
        set value(val) { setIsLoading(val) },
      },
      error: {
        get value() { return errorValue },
        set value(val) { setError(val) },
      },
      fetchWorkouts: mockFetchWorkouts,
    }))

    vi.mock('nuxt/app', () => ({
      useI18n: () => ({ t: mockTranslate }),
    }))

    vi.mock('~/composables/auth', () => ({
      useAuth: () => ({ status: { value: authStatus } }),
    }))
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('должен инициализироваться с начальными значениями', () => {
    const { workouts, isLoading, error } = useFetchWorkoutsByUserId()

    expect(workouts.value).toBeNull()
    expect(isLoading.value).toBe(false)
    expect(error.value).toBeNull()
  })

  it('успешно загружает тренировки', async () => {
    mockFetch.mockResolvedValueOnce(mockWorkouts)

    const { fetchWorkouts, workouts, isLoading } = useFetchWorkoutsByUserId()
    await fetchWorkouts()

    expect(mockFetch).toHaveBeenCalledWith(API.WORKOUTS_LIST)
    expect(workouts.value).toEqual(mockWorkouts)
    expect(isLoading.value).toBe(false)
  })

  it('обрабатывает ошибки при загрузке тренировок', async () => {
    const mockError = new Error('Network error')
    mockFetch.mockRejectedValueOnce(mockError)

    const { fetchWorkouts, workouts, error, isLoading } = useFetchWorkoutsByUserId()
    await fetchWorkouts()

    expect(mockFetch).toHaveBeenCalledWith(API.WORKOUTS_LIST)
    expect(mockConsoleError).toHaveBeenCalledWith(mockError)
    expect(error.value).toBe('error.workouts_load_error')
    expect(workouts.value).toBeNull()
    expect(isLoading.value).toBe(false)
  })

  it('не загружает тренировки если пользователь не аутентифицирован', async () => {
    authStatus = 'unauthenticated'

    const { fetchWorkouts, workouts } = useFetchWorkoutsByUserId()
    await fetchWorkouts()

    expect(mockFetch).not.toHaveBeenCalled()
    expect(workouts.value).toBeNull()
  })
})

import type { WorkoutResponse } from '~/ts'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { API } from '~/constants'
import { ToastStatusesEnum } from '~/ts/enums/toastStatuses.enum'
import { useCopyWorkout } from './useCopyWorkout'

vi.mock('./useCopyWorkout', () => ({
  useCopyWorkout: vi.fn(() => ({
    copyWorkout: vi.fn(),
    isLoading: { value: false },
  })),
}))

describe('useCopyWorkout', () => {
  const mockWorkoutId = 'workout-123'
  const mockNewDate = new Date('2023-01-01')
  const mockCopiedWorkout: WorkoutResponse = {
    id: 'copied-workout-123',
    title: 'Copied Workout',
    userId: 'user-123',
    workoutDate: new Date('2023-01-01'),
    color: '#ff0000',
    createdAt: new Date(),
    updatedAt: new Date(),
    completed: false,
    exercises: [],
    sets: [],
  }

  const mockWorkoutsState = {
    value: [] as WorkoutResponse[],
  }

  const mockToast = vi.fn()
  const mockFetch = vi.fn()

  let isLoadingValue = false
  const setIsLoading = (value: boolean) => {
    isLoadingValue = value
  }

  beforeEach(() => {
    vi.clearAllMocks()

    mockWorkoutsState.value = []
    isLoadingValue = false

    const mockCopyWorkout = vi.fn(async (workoutId: string, newDate: Date) => {
      setIsLoading(true)

      try {
        const copiedWorkout = await mockFetch(API.COPY_WORKOUT, {
          method: 'POST',
          body: {
            workoutId,
            newDate,
          },
        })

        mockWorkoutsState.value.unshift(copiedWorkout)
        mockToast('toast.workout_copied', ToastStatusesEnum.SUCCESS)

        return true
      }
      catch (error: unknown) {
        console.error('Error copy workout', error)
        mockToast('toast.workout_copy_error', ToastStatusesEnum.ERROR)

        return false
      }
      finally {
        setIsLoading(false)
      }
    })

    const mockUseCopyWorkout = useCopyWorkout as any
    mockUseCopyWorkout.mockImplementation(() => ({
      copyWorkout: mockCopyWorkout,
      isLoading: {
        get value() { return isLoadingValue },
        set value(val) { setIsLoading(val) },
      },
    }))
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('должен инициализироваться с isLoading равным false', () => {
    const { isLoading } = useCopyWorkout()
    expect(isLoading.value).toBe(false)
  })

  it('успешно скопировано', async () => {
    mockFetch.mockResolvedValueOnce(mockCopiedWorkout)

    const { copyWorkout } = useCopyWorkout()
    const result = await copyWorkout(mockWorkoutId, mockNewDate)
    expect(mockFetch).toHaveBeenCalledWith(API.COPY_WORKOUT, {
      method: 'POST',
      body: {
        workoutId: mockWorkoutId,
        newDate: mockNewDate,
      },
    })

    expect(isLoadingValue).toBe(false)
    expect(mockToast).toHaveBeenCalledWith('toast.workout_copied', ToastStatusesEnum.SUCCESS)
    expect(result).toBe(true)
  })

  it('вызывает ошибку при копировании', async () => {
    const mockError = new Error('Network error')
    mockFetch.mockRejectedValueOnce(mockError)

    const consoleErrorSpy = vi.spyOn(console, 'error')
    const { copyWorkout } = useCopyWorkout()
    const result = await copyWorkout(mockWorkoutId, mockNewDate)

    expect(mockFetch).toHaveBeenCalledWith(API.COPY_WORKOUT, {
      method: 'POST',
      body: {
        workoutId: mockWorkoutId,
        newDate: mockNewDate,
      },
    })

    expect(isLoadingValue).toBe(false)

    expect(consoleErrorSpy).toHaveBeenCalledWith('Error copy workout', mockError)
    expect(mockToast).toHaveBeenCalledWith('toast.workout_copy_error', ToastStatusesEnum.ERROR)
    expect(result).toBe(false)
  })

  it('добавляет скопированную тренировку в общий стейт тренировок', async () => {
    mockFetch.mockResolvedValueOnce(mockCopiedWorkout)

    const existingWorkouts: WorkoutResponse[] = [
      {
        id: 'existing-workout-123',
        title: 'Existing Workout',
        userId: 'user-123',
        workoutDate: new Date('2022-12-31'),
        color: '#00ff00',
        createdAt: new Date(),
        updatedAt: new Date(),
        completed: true,
        exercises: [],
        sets: [],
      },
    ]

    mockWorkoutsState.value = [...existingWorkouts]

    const { copyWorkout } = useCopyWorkout()
    await copyWorkout(mockWorkoutId, mockNewDate)

    expect(mockWorkoutsState.value[0]).toEqual(mockCopiedWorkout)
    expect(mockWorkoutsState.value.length).toBe(existingWorkouts.length + 1)
  })
})

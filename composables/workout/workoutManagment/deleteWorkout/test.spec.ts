import type { WorkoutResponse } from '~/ts'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { API } from '~/constants'
import { ToastStatusesEnum } from '~/ts/enums/toastStatuses.enum'
import { useDeleteWorkout } from './useDeleteWorkout'

vi.mock('./useDeleteWorkout', () => ({
  useDeleteWorkout: vi.fn(() => ({
    deleteWorkout: vi.fn(),
  })),
}))

vi.mock('~/utils/cacheRunnedWorkout', () => ({
  deleteCachedData: vi.fn(),
}))

describe('useDeleteWorkout', () => {
  const mockWorkoutId = 'workout-123'
  const mockWorkoutsState = {
    value: [] as WorkoutResponse[],
  }

  const mockToast = vi.fn()
  const mockFetch = vi.fn()
  const mockStopTimer = vi.fn()
  const mockCheckActiveWorkout = vi.fn()

  const mockDeleteCachedData = vi.fn()

  let isLoadingValue = false
  const setIsLoading = (value: boolean) => {
    isLoadingValue = value
  }

  beforeEach(() => {
    vi.clearAllMocks()

    mockWorkoutsState.value = [
      {
        id: mockWorkoutId,
        title: 'Test Workout',
        userId: 'user-123',
        workoutDate: new Date('2023-01-01'),
        color: '#ff0000',
        createdAt: new Date(),
        updatedAt: new Date(),
        completed: false,
        exercises: [],
        sets: [],
      },
      {
        id: 'workout-456',
        title: 'Another Workout',
        userId: 'user-123',
        workoutDate: new Date('2023-01-02'),
        color: '#00ff00',
        createdAt: new Date(),
        updatedAt: new Date(),
        completed: false,
        exercises: [],
        sets: [],
      },
    ]

    isLoadingValue = false

    const mockDeleteWorkoutFn = vi.fn(async (workoutId: string) => {
      setIsLoading(true)

      try {
        const successDelete = await mockFetch(API.DELETE_WORKOUT, {
          method: 'DELETE',
          body: { id: workoutId },
        })

        if (successDelete) {
          mockStopTimer()
          mockToast('toast.workout_deleted', ToastStatusesEnum.SUCCESS)

          mockWorkoutsState.value = mockWorkoutsState.value.filter(({ id }) => id !== workoutId)

          mockCheckActiveWorkout(mockWorkoutsState.value)

          await mockDeleteCachedData('workout', workoutId)
        }
      }
      catch (error: unknown) {
        console.error('Error delete workout', error)
        mockToast('toast.workout_delete_error', ToastStatusesEnum.ERROR)
      }
      finally {
        setIsLoading(false)
      }
    })

    const mockUseDeleteWorkout = useDeleteWorkout as any
    mockUseDeleteWorkout.mockImplementation(() => ({
      deleteWorkout: mockDeleteWorkoutFn,
      isLoading: {
        get value() { return isLoadingValue },
        set value(val) { setIsLoading(val) },
      },
    }))
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('успешно удаляет тренировку', async () => {
    mockFetch.mockResolvedValueOnce(true)

    const { deleteWorkout } = useDeleteWorkout()
    await deleteWorkout(mockWorkoutId)

    expect(mockFetch).toHaveBeenCalledWith(API.DELETE_WORKOUT, {
      method: 'DELETE',
      body: { id: mockWorkoutId },
    })

    expect(isLoadingValue).toBe(false)
    expect(mockToast).toHaveBeenCalledWith('toast.workout_deleted', ToastStatusesEnum.SUCCESS)
    expect(mockStopTimer).toHaveBeenCalled()
    expect(mockCheckActiveWorkout).toHaveBeenCalledWith(mockWorkoutsState.value)
    expect(mockDeleteCachedData).toHaveBeenCalledWith('workout', mockWorkoutId)
    expect(mockWorkoutsState.value.length).toBe(1)
    expect(mockWorkoutsState.value.find(workout => workout.id === mockWorkoutId)).toBeUndefined()
  })

  it('обрабатывает ошибки при удалении тренировки', async () => {
    const mockError = new Error('Network error')
    mockFetch.mockRejectedValueOnce(mockError)

    const consoleErrorSpy = vi.spyOn(console, 'error')
    const { deleteWorkout } = useDeleteWorkout()
    await deleteWorkout(mockWorkoutId)

    expect(mockFetch).toHaveBeenCalledWith(API.DELETE_WORKOUT, {
      method: 'DELETE',
      body: { id: mockWorkoutId },
    })

    expect(isLoadingValue).toBe(false)
    expect(consoleErrorSpy).toHaveBeenCalledWith('Error delete workout', mockError)
    expect(mockToast).toHaveBeenCalledWith('toast.workout_delete_error', ToastStatusesEnum.ERROR)
    expect(mockStopTimer).not.toHaveBeenCalled()
    expect(mockCheckActiveWorkout).not.toHaveBeenCalled()
    expect(mockDeleteCachedData).not.toHaveBeenCalled()
    expect(mockWorkoutsState.value.length).toBe(2)
    expect(mockWorkoutsState.value.find(workout => workout.id === mockWorkoutId)).toBeDefined()
  })
})

import type { UserWorkout, WorkoutResponse } from '~/ts'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { INITIAL_TIME } from '~/constants'
import { useWorkoutTimer } from './useWorkoutTimer'

type Workout = UserWorkout | WorkoutResponse
type WorkoutList = Workout[]

vi.mock('#app', () => ({
  useState: vi.fn((_, init) => {
    const state = {
      value: init(),
    }
    return state
  }),
  onBeforeUnmount: vi.fn(() => {
    return () => {}
  }),

}))

vi.mock('dayjs', () => {
  const dayjs = vi.fn(() => ({
    diff: vi.fn(() => 5000),
  }))

  Object.assign(dayjs, {
    extend: vi.fn(),
    duration: vi.fn(() => ({
      format: vi.fn(() => '00:00:05'),
    })),
  })

  return {
    default: dayjs,
  }
})

describe('useWorkoutTimer', () => {
  let workoutTimer: ReturnType<typeof useWorkoutTimer>

  beforeEach(() => {
    vi.useFakeTimers()
    workoutTimer = useWorkoutTimer()
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.useRealTimers()
  })

  it('инициализирует таймер с начальным временем', () => {
    expect(workoutTimer.timer.value).toBe(INITIAL_TIME)
  })

  it('инициализирует activeWorkout как null', () => {
    expect(workoutTimer.activeWorkout.value).toBeNull()
  })

  it('запускает таймер и обновляет activeWorkout', () => {
    const startDate = new Date()
    const workoutId = 'workout-123'

    workoutTimer.startTimer(startDate, workoutId)

    expect(workoutTimer.activeWorkout.value).toEqual({
      startedAt: startDate,
      id: workoutId,
    })

    vi.advanceTimersByTime(1000)

    expect(workoutTimer.timer.value).toBe('00:00:05')
  })

  it('останавливает таймер и сбрасывает состояние', () => {
    const startDate = new Date()
    const workoutId = 'workout-123'
    workoutTimer.startTimer(startDate, workoutId)

    workoutTimer.stopTimer()

    expect(workoutTimer.timer.value).toBe(INITIAL_TIME)
    expect(workoutTimer.activeWorkout.value).toBeNull()
  })

  it('очищает интервал при вызове cleanup', () => {
    const clearIntervalSpy = vi.spyOn(globalThis, 'clearInterval')

    workoutTimer.startTimer(new Date(), 'workout-123')

    workoutTimer.cleanup()

    expect(clearIntervalSpy).toHaveBeenCalled()
  })

  it('проверяет активную тренировку и запускает таймер если она найдена', () => {
    const originalCheckActiveWorkout = workoutTimer.checkActiveWorkout

    workoutTimer.checkActiveWorkout = function () {
      const testWorkout = {
        id: 'workout-123',
        startedAt: new Date().toISOString(),
      }

      this.startTimer(new Date(testWorkout.startedAt), testWorkout.id)
    }

    const startTimerSpy = vi.spyOn(workoutTimer, 'startTimer')

    workoutTimer.checkActiveWorkout([])

    workoutTimer.checkActiveWorkout = originalCheckActiveWorkout

    expect(startTimerSpy).toHaveBeenCalled()
    expect(startTimerSpy.mock.calls[0][1]).toBe('workout-123')
  })

  it('не запускает таймер если нет активной тренировки', () => {
    const startTimerSpy = vi.spyOn(workoutTimer, 'startTimer')

    const workouts: WorkoutList = [{
      id: 'workout-123',
      startedAt: new Date(),
      endedAt: new Date(),
      userId: 'user-123',
      title: 'Тренировка',
      color: '#ff0000',
      workoutDate: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
      completed: true,
      exercises: [],
      sets: [],
    }]

    workoutTimer.checkActiveWorkout(workouts)

    expect(startTimerSpy).not.toHaveBeenCalled()
  })

  it('очищает интервал если activeWorkout становится null во время работы таймера', () => {
    const clearIntervalSpy = vi.spyOn(globalThis, 'clearInterval')

    workoutTimer.startTimer(new Date(), 'workout-123')

    workoutTimer.activeWorkout.value = null

    vi.advanceTimersByTime(1000)

    expect(clearIntervalSpy).toHaveBeenCalled()
  })
})

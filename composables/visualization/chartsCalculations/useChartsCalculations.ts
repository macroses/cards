import type { WorkoutResponse } from '~/ts'
import type { ExerciseData } from '~/ts/interfaces'

interface GroupedWorkout {
  workoutDate: Date
  sets: any[]
  exercises: any[]
  workoutsCount: number
}

export function useChartsCalculations() {
  /**
   * Группирует тренировки по дате
   * Сложность: O(n), где n - количество тренировок
   */
  function groupWorkoutsByDate(workouts: WorkoutResponse[]): GroupedWorkout[] {
    if (!workouts || workouts.length === 0) {
      return []
    }

    const grouped: Record<string, GroupedWorkout> = {}

    for (const workout of workouts) {
      if (!workout.completed) {
        continue
      }

      const date = new Date(workout.workoutDate)
      const dateKey = date.toISOString().split('T')[0]

      if (!grouped[dateKey]) {
        grouped[dateKey] = {
          workoutDate: date,
          sets: [],
          exercises: [],
          workoutsCount: 0,
        }
      }

      grouped[dateKey].sets.push(...workout.sets)
      grouped[dateKey].exercises.push(...workout.exercises)
      grouped[dateKey].workoutsCount++
    }

    return Object.values(grouped)
  }

  /**
   * Рассчитывает данные для графика объема и интенсивности
   * Сложность: O(n * m), где n - количество сгруппированных дней, m - среднее число подходов в день
   */
  function calculateVolumeData(groupedWorkouts: GroupedWorkout[]) {
    const volumeData = []

    for (const workout of groupedWorkouts) {
      let totalVolume = 0
      let totalDuration = 0

      for (const set of workout.sets) {
        if (set.weight && set.repeats) {
          totalVolume += (set.weight * set.repeats)
        }
        totalDuration += (set.setTime || 0)
      }

      volumeData.push({
        date: workout.workoutDate,
        volume: totalVolume / 1000,
        intensity: totalDuration > 0 ? totalVolume / totalDuration : 0,
        workoutsCount: workout.workoutsCount,
      })
    }

    return volumeData
  }

  /**
   * Рассчитывает данные для графика длительности
   * Сложность: O(n * m), где n - количество сгруппированных дней, m - среднее число подходов в день
   */
  function calculateDurationData(groupedWorkouts: GroupedWorkout[]) {
    const durationData = []

    for (const workout of groupedWorkouts) {
      let duration = 0

      for (const set of workout.sets) {
        duration += (set.setTime || 0)
      }

      durationData.push({
        date: workout.workoutDate,
        duration,
        avgSetTime: workout.sets.length > 0 ? duration / workout.sets.length : 0,
        workoutsCount: workout.workoutsCount,
      })
    }

    return durationData
  }

  /**
   * Находит популярные упражнения
   * Сложность: O(n * e), где n - количество сгруппированных дней, e - среднее число упражнений в день
   */
  function findPopularExercises(groupedWorkouts: GroupedWorkout[], limit = 10) {
    const exerciseCounts: Record<string, number> = {}

    for (const workout of groupedWorkouts) {
      for (const exercise of workout.exercises) {
        if (exercise.exerciseId) {
          exerciseCounts[exercise.exerciseId] = (exerciseCounts[exercise.exerciseId] || 0) + 1
        }
      }
    }

    return Object.entries(exerciseCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, limit)
      .map(([id]) => id)
  }

  /**
   * Рассчитывает данные для графиков упражнений
   * Сложность: O(e * n * s), где e - количество популярных упражнений, n - количество сгруппированных дней,
   * s - среднее число подходов для упражнения в день
   */
  function calculateExerciseData(groupedWorkouts: GroupedWorkout[], popularExercises: string[]) {
    const exerciseData: Record<string, ExerciseData[]> = {}

    for (const exerciseId of popularExercises) {
      exerciseData[exerciseId] = []

      for (const workout of groupedWorkouts) {
        const sets = workout.sets.filter(set => set.exerciseId === exerciseId)

        if (sets.length > 0) {
          // Находим максимальный вес
          let maxWeight = -Infinity
          let totalWeight = 0

          for (const set of sets) {
            if (set.weight > maxWeight) {
              maxWeight = set.weight
            }
            totalWeight += set.weight
          }

          exerciseData[exerciseId].push({
            date: workout.workoutDate,
            maxWeight,
            avgWeight: totalWeight / sets.length,
            setsCount: sets.length,
          })
        }
      }
    }

    return exerciseData
  }

  /**
   * Основная функция для расчета всех данных графиков
   */
  function calculateChartsData(workouts: WorkoutResponse[]) {
    if (!workouts || workouts.length === 0) {
      return {
        volumeData: [],
        durationData: [],
        popularExercises: [],
        exerciseData: {},
      }
    }

    // Шаг 1: Группируем тренировки по дате
    const groupedWorkouts = groupWorkoutsByDate(workouts)

    // Шаг 2: Рассчитываем данные для графиков
    const volumeData = calculateVolumeData(groupedWorkouts)
    const durationData = calculateDurationData(groupedWorkouts)
    const popularExercises = findPopularExercises(groupedWorkouts)
    const exerciseData = calculateExerciseData(groupedWorkouts, popularExercises)

    return {
      volumeData,
      durationData,
      popularExercises,
      exerciseData,
    }
  }

  return {
    calculateChartsData,
  }
}

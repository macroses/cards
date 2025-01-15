import type { CreateWorkoutResponse } from '~/ts/interfaces/createWorkout.interface'

export function useWorkoutResults() {
  const { t } = useI18n()

  const getExerciseData = (workout: CreateWorkoutResponse, exerciseId: number, workouts: CreateWorkoutResponse[]) => {
    const exerciseSets = workout.sets.filter(set => set.exerciseId === exerciseId)

    // Находим предыдущую тренировку с тем же упражнением
    const previousWorkout = workouts
      .filter(w =>
        w.id !== workout.id
        && w.completed
        && new Date(w.workoutDate) < new Date(workout.workoutDate)
        && w.exercises.some(e => e.exerciseId === exerciseId),
      )
      .sort((a, b) => new Date(b.workoutDate).getTime() - new Date(a.workoutDate).getTime())[0]

    const previousSets = previousWorkout?.sets.filter(set => set.exerciseId === exerciseId) || []

    // Создаем массив с номерами сетов для оси X, берем максимальное количество сетов
    const maxSets = Math.max(exerciseSets.length, previousSets.length)
    const xAxisData = Array.from({ length: maxSets }, (_, i) => `Сет ${i + 1}`)

    return {
      weight: {
        xAxis: {
          type: 'category',
          data: xAxisData,
        },
        yAxis: {
          type: 'value',
          name: t('workout.weight'),
        },
        series: [
          {
            name: t('workout.current_workout'),
            data: exerciseSets.map(set => set.weight),
            type: 'line',
            smooth: true,
            lineStyle: {
              width: 3,
            },
          },
          {
            name: t('workout.previous_workout'),
            data: previousSets.map(set => set.weight),
            type: 'line',
            smooth: true,
            lineStyle: {
              type: 'dashed',
              width: 2,
            },
          },
        ],
        tooltip: {
          trigger: 'axis',
        },
        legend: {
          show: true,
        },
      },
      repeats: {
        xAxis: {
          type: 'category',
          data: xAxisData,
        },
        yAxis: {
          type: 'value',
          name: t('workout.repeats'),
        },
        series: [
          {
            name: t('workout.current_workout'),
            data: exerciseSets.map(set => set.repeats),
            type: 'line',
            smooth: true,
            lineStyle: {
              width: 3,
            },
          },
          {
            name: t('workout.previous_workout'),
            data: previousSets.map(set => set.repeats),
            type: 'line',
            smooth: true,
            lineStyle: {
              type: 'dashed',
              width: 2,
            },
          },
        ],
        tooltip: {
          trigger: 'axis',
        },
        legend: {
          show: true,
        },
      },
      time: {
        xAxis: {
          type: 'category',
          data: xAxisData,
        },
        yAxis: {
          type: 'value',
          name: t('workout.time'),
        },
        series: [
          {
            name: t('workout.current_workout'),
            data: exerciseSets.map(set => set.setTime || 0),
            type: 'line',
            smooth: true,
            lineStyle: {
              width: 3,
            },
          },
          {
            name: t('workout.previous_workout'),
            data: previousSets.map(set => set.setTime || 0),
            type: 'line',
            smooth: true,
            lineStyle: {
              type: 'dashed',
              width: 2,
            },
          },
        ],
        tooltip: {
          trigger: 'axis',
        },
        legend: {
          show: true,
        },
      },
    }
  }

  const getProgressData = (currentWorkout: CreateWorkoutResponse, exerciseId: number, workouts: CreateWorkoutResponse[]) => {
    // Находим предыдущую тренировку с тем же упражнением
    const previousWorkout = workouts
      .filter(w =>
        w.id !== currentWorkout.id
        && w.completed
        && new Date(w.workoutDate) < new Date(currentWorkout.workoutDate)
        && w.exercises.some(e => e.exerciseId === exerciseId),
      )
      .sort((a, b) => new Date(b.workoutDate).getTime() - new Date(a.workoutDate).getTime())[0]

    if (!previousWorkout) {
      return null
    }

    const currentSets = currentWorkout.sets.filter(set => set.exerciseId === exerciseId)
    const previousSets = previousWorkout.sets.filter(set => set.exerciseId === exerciseId)

    // Рассчитываем средние значения
    const currentAvg = {
      weight: currentSets.reduce((sum, set) => sum + set.weight, 0) / currentSets.length,
      repeats: currentSets.reduce((sum, set) => sum + set.repeats, 0) / currentSets.length,
      time: currentSets.reduce((sum, set) => sum + (set.setTime || 0), 0) / currentSets.length,
    }

    const previousAvg = {
      weight: previousSets.reduce((sum, set) => sum + set.weight, 0) / previousSets.length,
      repeats: previousSets.reduce((sum, set) => sum + set.repeats, 0) / previousSets.length,
      time: previousSets.reduce((sum, set) => sum + (set.setTime || 0), 0) / previousSets.length,
    }

    // Рассчитываем максимальные значения
    const currentMax = {
      weight: Math.max(...currentSets.map(set => set.weight)),
      repeats: Math.max(...currentSets.map(set => set.repeats)),
      time: Math.max(...currentSets.map(set => set.setTime || 0)),
    }

    const previousMax = {
      weight: Math.max(...previousSets.map(set => set.weight)),
      repeats: Math.max(...previousSets.map(set => set.repeats)),
      time: Math.max(...previousSets.map(set => set.setTime || 0)),
    }

    // Рассчитываем процентное изменение
    const getPercentChange = (current: number, previous: number) => {
      if (previous === 0)
        return current > 0 ? 100 : 0
      return ((current - previous) / previous) * 100
    }

    return {
      weight: {
        current: currentAvg.weight,
        previous: previousAvg.weight,
        change: getPercentChange(currentAvg.weight, previousAvg.weight),
        max: {
          current: currentMax.weight,
          previous: previousMax.weight,
          change: getPercentChange(currentMax.weight, previousMax.weight),
        },
      },
      repeats: {
        current: currentAvg.repeats,
        previous: previousAvg.repeats,
        change: getPercentChange(currentAvg.repeats, previousAvg.repeats),
        max: {
          current: currentMax.repeats,
          previous: previousMax.repeats,
          change: getPercentChange(currentMax.repeats, previousMax.repeats),
        },
      },
      time: {
        current: currentAvg.time,
        previous: previousAvg.time,
        change: getPercentChange(currentAvg.time, previousAvg.time),
        max: {
          current: currentMax.time,
          previous: previousMax.time,
          change: getPercentChange(currentMax.time, previousMax.time),
        },
      },
      previousWorkoutDate: previousWorkout.workoutDate,
    }
  }

  return {
    getExerciseData,
    getProgressData,
  }
}

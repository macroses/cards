import type { CreateWorkoutResponse } from '~/ts/interfaces/createWorkout.interface'

export function useWorkoutResults() {
  const getExerciseData = (workout: CreateWorkoutResponse, exerciseId: number) => {
    const exerciseSets = workout.sets.filter(set => set.exerciseId === exerciseId)

    return {
      weight: {
        xAxis: {
          type: 'category',
          data: exerciseSets.map((_, index) => `Сет ${index + 1}`),
        },
        yAxis: {
          type: 'value',
          name: 'Вес (кг)',
        },
        series: [{
          data: exerciseSets.map(set => set.weight),
          type: 'line',
          smooth: true,
        }],
        tooltip: {
          trigger: 'axis',
        },
      },
      repeats: {
        xAxis: {
          type: 'category',
          data: exerciseSets.map((_, index) => `Сет ${index + 1}`),
        },
        yAxis: {
          type: 'value',
          name: 'Повторения',
        },
        series: [{
          data: exerciseSets.map(set => set.repeats),
          type: 'line',
          smooth: true,
        }],
        tooltip: {
          trigger: 'axis',
        },
      },
      time: {
        xAxis: {
          type: 'category',
          data: exerciseSets.map((_, index) => `Сет ${index + 1}`),
        },
        yAxis: {
          type: 'value',
          name: 'Время (сек)',
        },
        series: [{
          data: exerciseSets.map(set => set.setTime || 0),
          type: 'line',
          smooth: true,
        }],
        tooltip: {
          trigger: 'axis',
        },
      },
    }
  }

  return {
    getExerciseData,
  }
}

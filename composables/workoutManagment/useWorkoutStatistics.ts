import type { CreateWorkoutResponse } from '~/ts/interfaces'

export function useWorkoutStatistics() {
  // Общая статистика
  function getGeneralStats(workouts: CreateWorkoutResponse[]) {
    const totalWorkouts = workouts.length
    const completedWorkouts = workouts.filter(w => w.completed).length
    const completionRate = totalWorkouts ? (completedWorkouts / totalWorkouts) * 100 : 0

    const averageDuration = calculateAverageWorkoutDuration(workouts)
    const activeDays = getActiveDays(workouts)
    const mostProductiveMonths = getProductiveMonths(workouts)
    const longestStreak = calculateLongestStreak(workouts)
    const maxExercisesPerWorkout = Math.max(...workouts.map(w => w.exercises.length))
    const maxSetsPerWorkout = Math.max(...workouts.map(w => w.sets.length))

    return {
      totalWorkouts,
      completedWorkouts,
      completionRate: Math.round(completionRate),
      averageDuration,
      activeDays,
      mostProductiveMonths,
      longestStreak,
      maxExercisesPerWorkout,
      maxSetsPerWorkout,
    }
  }

  function calculateAverageWorkoutDuration(workouts: CreateWorkoutResponse[]) {
    const durationsInMinutes = workouts
      .filter(w => w.startedAt && w.endedAt)
      .map((w) => {
        const start = new Date(w.startedAt!)
        const end = new Date(w.endedAt!)
        return (end.getTime() - start.getTime()) / (1000 * 60)
      })

    return durationsInMinutes.length
      ? Math.round(durationsInMinutes.reduce((a, b) => a + b, 0) / durationsInMinutes.length)
      : 0
  }

  function getActiveDays(workouts: CreateWorkoutResponse[]) {
    const dayCount = Array.from({ length: 7 }).fill(0)
    workouts.forEach((workout) => {
      const day = new Date(workout.workoutDate).getDay()
      dayCount[day]++
    })

    return dayCount.map((count, index) => ({
      day: index,
      count,
    })).sort((a, b) => b.count - a.count)
  }

  function getProductiveMonths(workouts: CreateWorkoutResponse[]) {
    const monthStats = workouts.reduce((acc, workout) => {
      const date = new Date(workout.workoutDate)
      const key = `${date.getFullYear()}-${date.getMonth()}`
      if (!acc[key]) {
        acc[key] = { count: 0, completedSets: 0 }
      }
      acc[key].count++
      acc[key].completedSets += workout.sets.filter(s => s.completed).length
      return acc
    }, {} as Record<string, { count: number, completedSets: number }>)

    return Object.entries(monthStats)
      .map(([date, stats]) => ({
        date,
        ...stats,
      }))
      .sort((a, b) => b.completedSets - a.completedSets)
  }

  function calculateLongestStreak(workouts: CreateWorkoutResponse[]) {
    if (!workouts.length)
      return 0

    const dates = workouts
      .map(w => new Date(w.workoutDate).toISOString().split('T')[0])
      .sort()

    let currentStreak = 1
    let maxStreak = 1

    for (let i = 1; i < dates.length; i++) {
      const prevDate = new Date(dates[i - 1])
      const currDate = new Date(dates[i])
      const diffDays = (currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24)

      if (diffDays === 1) {
        currentStreak++
        maxStreak = Math.max(maxStreak, currentStreak)
      }
      else {
        currentStreak = 1
      }
    }

    return maxStreak
  }

  // Статистика упражнений
  function getMostFrequentExercises(workouts: CreateWorkoutResponse[]) {
    const exerciseCounts = new Map<number, { count: number, name: string }>()

    workouts.forEach((workout) => {
      workout.exercises.forEach((exercise) => {
        const current = exerciseCounts.get(exercise.exerciseId) || { count: 0, name: exercise.exerciseName }
        exerciseCounts.set(exercise.exerciseId, {
          count: current.count + 1,
          name: exercise.exerciseName,
        })
      })
    })

    return Array.from(exerciseCounts.entries())
      .sort(([, a], [, b]) => b.count - a.count)
      .slice(0, 5)
      .map(([id, data]) => ({ id, ...data }))
  }

  function getExerciseStats(workouts: CreateWorkoutResponse[], exerciseId: number) {
    const sets = workouts.flatMap(w => w.sets.filter(s => s.exerciseId === exerciseId))

    const maxWeight = Math.max(...sets.map(s => s.weight))
    const avgWeight = sets.reduce((sum, set) => sum + set.weight, 0) / sets.length
    const avgRepeats = sets.reduce((sum, set) => sum + set.repeats, 0) / sets.length
    const totalSets = sets.length
    const completedSets = sets.filter(s => s.completed).length
    const completionRate = (completedSets / totalSets) * 100

    const difficultyDistribution = sets.reduce((acc, set) => {
      acc[set.difficulty] = (acc[set.difficulty] || 0) + 1
      return acc
    }, {} as Record<number, number>)

    // Расчет среднего времени отдыха между подходами
    const restTimes: number[] = []
    workouts.forEach((workout) => {
      const exerciseSets = workout.sets
        .filter(s => s.exerciseId === exerciseId && s.setTimeAddedAt)
        .sort((a, b) => new Date(a.setTimeAddedAt!).getTime() - new Date(b.setTimeAddedAt!).getTime())

      for (let i = 1; i < exerciseSets.length; i++) {
        const prevSet = new Date(exerciseSets[i - 1].setTimeAddedAt!).getTime()
        const currSet = new Date(exerciseSets[i].setTimeAddedAt!).getTime()
        restTimes.push((currSet - prevSet) / 1000)
      }
    })

    const avgRestTime = restTimes.length
      ? Math.round(restTimes.reduce((a, b) => a + b, 0) / restTimes.length)
      : 0

    return {
      maxWeight: Math.round(maxWeight * 10) / 10,
      avgWeight: Math.round(avgWeight * 10) / 10,
      avgRepeats: Math.round(avgRepeats * 10) / 10,
      totalSets,
      completedSets,
      completionRate: Math.round(completionRate),
      difficultyDistribution,
      avgRestTime,
    }
  }

  function getExerciseProgress(workouts: CreateWorkoutResponse[], exerciseId: number) {
    const progress = workouts
      .filter(w => w.exercises.some(e => e.exerciseId === exerciseId))
      .map(w => ({
        date: new Date(w.workoutDate),
        maxWeight: Math.max(...w.sets
          .filter(s => s.exerciseId === exerciseId)
          .map(s => s.weight)),
        avgWeight: w.sets
          .filter(s => s.exerciseId === exerciseId)
          .reduce((sum, s) => sum + s.weight, 0) / w.sets.filter(s => s.exerciseId === exerciseId).length,
        totalSets: w.sets.filter(s => s.exerciseId === exerciseId).length,
      }))
      .sort((a, b) => a.date.getTime() - b.date.getTime())

    return progress
  }

  // Графики
  function getWeightProgressChartData(workouts: CreateWorkoutResponse[], exerciseId: number) {
    const progress = getExerciseProgress(workouts, exerciseId)
    const exerciseName = workouts.find(w =>
      w.exercises.some(e => e.exerciseId === exerciseId),
    )?.exercises.find(e => e.exerciseId === exerciseId)?.exerciseName || ''

    return {
      title: {
        text: exerciseName,
        left: 'center',
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
        },
      },
      legend: {
        data: ['Максимальный вес', 'Средний вес', 'Количество подходов'],
        top: 30,
      },
      grid: {
        right: '15%',
      },
      xAxis: {
        type: 'category',
        data: progress.map(p => p.date.toLocaleDateString()),
        axisLabel: {
          rotate: 45,
        },
      },
      yAxis: [
        {
          type: 'value',
          name: 'Вес (кг)',
          position: 'left',
        },
        {
          type: 'value',
          name: 'Подходы',
          position: 'right',
        },
      ],
      series: [
        {
          name: 'Максимальный вес',
          data: progress.map(p => p.maxWeight),
          type: 'line',
          smooth: true,
          lineStyle: {
            width: 3,
            color: '#ff6b6b',
          },
          itemStyle: {
            color: '#ff6b6b',
          },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: 'rgba(255, 107, 107, 0.3)' },
                { offset: 1, color: 'rgba(255, 107, 107, 0.1)' },
              ],
            },
          },
        },
        {
          name: 'Средний вес',
          data: progress.map(p => p.avgWeight),
          type: 'line',
          smooth: true,
          lineStyle: {
            width: 2,
            type: 'dashed',
            color: '#4ecdc4',
          },
          itemStyle: {
            color: '#4ecdc4',
          },
        },
        {
          name: 'Количество подходов',
          data: progress.map(p => p.totalSets),
          type: 'bar',
          yAxisIndex: 1,
          itemStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: '#a8e6cf' },
                { offset: 1, color: '#dcedc1' },
              ],
            },
            borderRadius: [3, 3, 0, 0],
          },
        },
      ],
      animation: true,
      animationDuration: 1000,
      animationEasing: 'cubicInOut',
    }
  }

  function getActivityHeatmapData(workouts: CreateWorkoutResponse[]) {
    const activityData = workouts.reduce((acc, workout) => {
      const date = new Date(workout.workoutDate).toISOString().split('T')[0]
      acc[date] = (acc[date] || 0) + workout.sets.length
      return acc
    }, {} as Record<string, number>)

    return Object.entries(activityData).map(([date, value]) => [date, value])
  }

  function getActiveDaysChart(workouts: CreateWorkoutResponse[]) {
    const activeDays = getActiveDays(workouts)
    const weekDays = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб']

    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        data: activeDays.map(d => weekDays[d.day]),
        axisLine: {
          lineStyle: {
            color: '#666',
          },
        },
      },
      yAxis: {
        type: 'value',
        name: 'Количество тренировок',
        nameTextStyle: {
          padding: [0, 0, 0, 40],
        },
        splitLine: {
          lineStyle: {
            type: 'dashed',
          },
        },
      },
      series: [
        {
          data: activeDays.map(d => ({
            value: d.count,
            itemStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  { offset: 0, color: '#06d6a0' },
                  { offset: 1, color: '#118ab2' },
                ],
              },
              borderRadius: [8, 8, 0, 0],
            },
          })),
          type: 'bar',
          showBackground: true,
          backgroundStyle: {
            color: 'rgba(180, 180, 180, 0.1)',
            borderRadius: [8, 8, 0, 0],
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
          label: {
            show: true,
            position: 'top',
            formatter: '{c}',
          },
          barWidth: '50%',
          barMaxWidth: 60,
        },
      ],
      animation: true,
      animationDuration: 1000,
      animationEasing: 'bounceOut',
    }
  }

  function getMonthlyProgressChart(workouts: CreateWorkoutResponse[]) {
    const monthlyData = getProductiveMonths(workouts)
    const recentMonths = monthlyData.slice(0, 6).reverse()

    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
      },
      legend: {
        data: ['Тренировки', 'Выполненные подходы'],
        top: 20,
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        data: recentMonths.map((m) => {
          const [year, month] = m.date.split('-')
          return `${new Date(Number(year), Number(month)).toLocaleString('default', { month: 'short' })}`
        }),
      },
      yAxis: [
        {
          type: 'value',
          name: 'Тренировки',
          position: 'left',
        },
        {
          type: 'value',
          name: 'Подходы',
          position: 'right',
        },
      ],
      series: [
        {
          name: 'Тренировки',
          type: 'scatter',
          symbolSize(data: number) {
            return Math.sqrt(data) * 15
          },
          data: recentMonths.map(m => m.count),
          itemStyle: {
            color: '#ff9f1c',
            shadowBlur: 10,
            shadowColor: 'rgba(0, 0, 0, 0.3)',
          },
        },
        {
          name: 'Выполненные подходы',
          type: 'bar',
          yAxisIndex: 1,
          data: recentMonths.map(m => m.completedSets),
          itemStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: '#2ec4b6' },
                { offset: 1, color: '#cbf3f0' },
              ],
            },
            borderRadius: [8, 8, 0, 0],
          },
        },
      ],
      animation: true,
      animationDuration: 1000,
      animationEasing: 'elasticOut',
    }
  }

  return {
    getGeneralStats,
    calculateAverageWorkoutDuration,
    getMostFrequentExercises,
    getExerciseStats,
    getExerciseProgress,
    getWeightProgressChartData,
    getActivityHeatmapData,
    getActiveDaysChart,
    getMonthlyProgressChart,
  }
}

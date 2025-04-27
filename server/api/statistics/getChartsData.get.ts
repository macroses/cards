import type { ExerciseData } from '~/ts/interfaces'
import { getServerSession } from '#auth'

interface GroupedWorkout {
  workoutDate: Date
  sets: any[]
  exercises: any[]
  workoutsCount: number
}

function groupWorkoutsByDate(workouts: any[]): GroupedWorkout[] {
  const grouped = workouts.reduce((acc, { workoutDate, sets, exercises }) => {
    const date = new Date(workoutDate)
    const dateKey = date.toISOString().split('T')[0]

    if (!acc[dateKey]) {
      acc[dateKey] = {
        workoutDate: date,
        sets: [],
        exercises: [],
        workoutsCount: 0,
      }
    }

    acc[dateKey].sets.push(...sets)
    acc[dateKey].exercises.push(...exercises)
    acc[dateKey].workoutsCount++

    return acc
  }, {} as Record<string, GroupedWorkout>)

  return Object.values(grouped)
}

export default defineEventHandler(async (event) => {
  const session = await getServerSession(event)

  if (!session) {
    throw createError({
      statusCode: 401,
      message: 'Необходима авторизация',
    })
  }

  try {
    const workouts = await event.context.prisma.workout.findMany({
      where: {
        userId: session.user.id,
        completed: true,
      },
      include: {
        sets: true,
        exercises: true,
      },
      orderBy: {
        workoutDate: 'asc',
      },
    })

    // Группируем тренировки по дате
    const groupedWorkouts = groupWorkoutsByDate(workouts)

    // Данные для графика объема и интенсивности
    const volumeData = groupedWorkouts.map(({ sets, workoutDate, workoutsCount }) => {
      const totalVolume = sets.reduce((sum, set) => {
        if (!set.weight || !set.repeats)
          return sum
        return sum + (set.weight * set.repeats)
      }, 0)

      const totalDuration = sets.reduce((sum, set) => {
        return sum + (set.setTime || 0)
      }, 0)

      return {
        date: workoutDate,
        volume: totalVolume / 1000,
        intensity: totalDuration > 0 ? totalVolume / totalDuration : 0,
        workoutsCount,
      }
    })

    // Данные для графика длительности
    const durationData = groupedWorkouts.map((workout) => {
      const duration = workout.sets.reduce((sum, set) => {
        return sum + (set.setTime || 0)
      }, 0)

      return {
        date: workout.workoutDate,
        duration,
        avgSetTime: duration / workout.sets.length,
        workoutsCount: workout.workoutsCount,
      }
    })

    // Популярные упражнения
    const exerciseCounts: Record<string, number> = {}

    groupedWorkouts.forEach(({ exercises }) => {
      exercises.forEach((exercise) => {
        if (exercise.exerciseId) {
          exerciseCounts[exercise.exerciseId] = (exerciseCounts[exercise.exerciseId] || 0) + 1
        }
      })
    })

    const popularExercises = Object.entries(exerciseCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([id]) => id)

    // Данные прогресса по упражнениям
    const exerciseData: Record<string, ExerciseData[]> = {}

    popularExercises.forEach((exerciseId: string) => {
      exerciseData[exerciseId] = groupedWorkouts
        .map((workout) => {
          const sets = workout.sets.filter(set => set.exerciseId === exerciseId)
          if (!sets.length)
            return null

          return {
            date: workout.workoutDate,
            maxWeight: Math.max(...sets.map(({ weight }) => weight)),
            avgWeight: sets.reduce((sum, { weight }) => sum + weight, 0) / sets.length,
            setsCount: sets.length,
          }
        })
        .filter((item): item is ExerciseData => item !== null)
    })

    return {
      volumeData,
      durationData,
      popularExercises,
      exerciseData,
    }
  }
  catch (error: any) {
    throw createError({
      statusCode: 500,
      message: `Ошибка при получении данных для графиков: ${error.message}`,
    })
  }
})

import { getServerSession } from '#auth'
import type { ExerciseData } from '~/ts/interfaces'

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
      },
      include: {
        sets: true,
        exercises: true,
      },
      orderBy: {
        workoutDate: 'asc',
      },
    })

    // Данные для графика объема и интенсивности
    const volumeData = workouts.map((workout) => {
      const totalVolume = workout.sets.reduce((sum, set) => {
        if (!set.weight || !set.repeats)
          return sum
        return sum + (set.weight * set.repeats)
      }, 0)

      const totalDuration = workout.sets.reduce((sum, set) => {
        return sum + (set.setTime || 0)
      }, 0)

      return {
        date: workout.workoutDate,
        volume: totalVolume / 1000,
        intensity: totalDuration > 0 ? totalVolume / totalDuration : 0,
      }
    })

    // Данные для графика длительности
    const durationData = workouts.map((workout) => {
      const duration = workout.sets.reduce((sum, set) => {
        return sum + (set.setTime || 0)
      }, 0)

      return {
        date: workout.workoutDate,
        duration,
        avgSetTime: duration / workout.sets.length,
      }
    })

    // Популярные упражнения
    const exerciseCounts: Record<number, number> = {}
    workouts.forEach((workout) => {
      workout.exercises.forEach((exercise) => {
        if (exercise.exerciseId)
          exerciseCounts[exercise.exerciseId] = (exerciseCounts[exercise.exerciseId] || 0) + 1
      })
    })

    const popularExercises = Object.entries(exerciseCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([id]) => Number(id))

    // Данные прогресса по упражнениям
    const exerciseData: Record<number, ExerciseData[]> = {}
    popularExercises.forEach((exerciseId) => {
      exerciseData[exerciseId] = workouts
        .map((workout) => {
          const sets = workout.sets.filter(set => set.exerciseId === exerciseId)
          if (!sets.length)
            return null

          return {
            date: workout.workoutDate,
            maxWeight: Math.max(...sets.map(s => s.weight)),
            avgWeight: sets.reduce((sum, s) => sum + s.weight, 0) / sets.length,
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

import { getServerSession } from '#auth'

const SECOND = 1000
const MINUTE = 60

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
      },
    })

    // Получаем только завершенные тренировки для расчета статистики
    const completedWorkouts = workouts.filter(w => w.completed)

    // Максимальный тоннаж за тренировку
    const maxTonnage = Math.max(...completedWorkouts.map((workout) => {
      return workout.sets.reduce((sum, set) => {
        return sum + (set.weight * set.repeats) / SECOND
      }, 0)
    }))

    // Общий тоннаж за все тренировки
    const totalTonnage = completedWorkouts.reduce((total, workout) => {
      const workoutTonnage = workout.sets.reduce((sum, set) => {
        return sum + (set.weight * set.repeats) / SECOND
      }, 0)

      return total + workoutTonnage
    }, 0)

    // Среднее время тренировки
    const avgWorkoutDuration = completedWorkouts.reduce((total, workout) => {
      if (workout.startedAt && workout.endedAt) {
        return total + (new Date(workout.endedAt).getTime() - new Date(workout.startedAt).getTime()) / (SECOND * MINUTE)
      }

      return total
    }, 0) / completedWorkouts.filter(w => w.startedAt && w.endedAt).length

    // Среднее время на подход
    const avgSetTime = completedWorkouts.reduce((total, workout) => {
      const workoutSetTimes = workout.sets.reduce((sum, set) => {
        return sum + (set.setTime || 0)
      }, 0)

      return total + workoutSetTimes
    }, 0) / completedWorkouts.reduce((total, workout) => total + workout.sets.length, 0)

    return {
      maxTonnage: Number(maxTonnage.toFixed(2)),
      totalTonnage: Number(totalTonnage.toFixed(2)),
      avgWorkoutDuration: Math.round(avgWorkoutDuration),
      avgSetTime: Math.round(avgSetTime),
      completedWorkouts: completedWorkouts.length,
      totalWorkouts: workouts.length,
    }
  }
  catch (error: any) {
    throw createError({
      statusCode: 500,
      message: `Ошибка при получении статистики: ${error.message}`,
    })
  }
})

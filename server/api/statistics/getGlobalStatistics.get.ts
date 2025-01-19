import { getServerSession } from '#auth'

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
      },
    })

    // Максимальный тоннаж за тренировку
    const maxTonnage = Math.max(...workouts.map((workout) => {
      return workout.sets.reduce((sum, set) => {
        return sum + (set.weight * set.repeats) / 1000
      }, 0)
    }))

    // Общий тоннаж за все тренировки
    const totalTonnage = workouts.reduce((total, workout) => {
      const workoutTonnage = workout.sets.reduce((sum, set) => {
        return sum + (set.weight * set.repeats) / 1000
      }, 0)
      return total + workoutTonnage
    }, 0)

    // Среднее время тренировки (в минутах)
    const avgWorkoutDuration = workouts.reduce((total, workout) => {
      if (workout.startedAt && workout.endedAt) {
        return total + (new Date(workout.endedAt).getTime() - new Date(workout.startedAt).getTime()) / (1000 * 60)
      }
      return total
    }, 0) / workouts.filter(w => w.startedAt && w.endedAt).length

    // Среднее время на подход (в секундах)
    const avgSetTime = workouts.reduce((total, workout) => {
      const workoutSetTimes = workout.sets.reduce((sum, set) => {
        return sum + (set.setTime || 0)
      }, 0)
      return total + workoutSetTimes
    }, 0) / workouts.reduce((total, workout) => total + workout.sets.length, 0)

    return {
      maxTonnage: Number(maxTonnage.toFixed(2)),
      totalTonnage: Number(totalTonnage.toFixed(2)),
      avgWorkoutDuration: Math.round(avgWorkoutDuration),
      avgSetTime: Math.round(avgSetTime),
      completedWorkouts: workouts.length,
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

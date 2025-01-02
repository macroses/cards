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
    const { workoutId, completed } = await readBody(event)

    if (!workoutId) {
      throw createError({
        statusCode: 400,
        message: 'ID тренировки обязателен',
      })
    }

    // Проверяем доступ к тренировке
    const workout = await event.context.prisma.workout.findUnique({
      where: { id: workoutId },
    })

    if (!workout) {
      throw createError({
        statusCode: 404,
        message: 'Тренировка не найдена',
      })
    }

    if (workout.userId !== session.user.id) {
      throw createError({
        statusCode: 403,
        message: 'Нет доступа к этой тренировке',
      })
    }

    if (!workout.startedAt) {
      throw createError({
        statusCode: 400,
        message: 'Тренировка не была начата',
      })
    }

    // Удаляем сеты без времени
    await event.context.prisma.workoutSet.deleteMany({
      where: {
        workoutId,
        setTime: null,
      },
    })

    const updatedWorkout = await event.context.prisma.workout.update({
      where: { id: workoutId },
      data: {
        endedAt: new Date(),
        completed: completed || true,
      },
    })

    return updatedWorkout
  }
  catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Ошибка при завершении тренировки',
    })
  }
})

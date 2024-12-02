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
    const { workoutId } = await readBody(event)

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

    // Обновляем поле startedAt
    const updatedWorkout = await event.context.prisma.workout.update({
      where: { id: workoutId },
      data: {
        startedAt: new Date(),
      },
    })

    return updatedWorkout
  }
  catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Ошибка при начале тренировки',
    })
  }
})

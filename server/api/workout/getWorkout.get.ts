import { getServerSession } from '#auth'

export default defineEventHandler(async (event) => {
  const session = await getServerSession(event)

  if (!session) {
    throw createError({
      statusCode: 401,
      message: 'Необходима авторизация',
    })
  }

  const query = getQuery(event)
  const workoutId = query.id as string

  if (!workoutId) {
    throw createError({
      statusCode: 400,
      message: 'ID тренировки обязателен',
    })
  }

  try {
    const workout = await event.context.prisma.workout.findUnique({
      where: { id: workoutId },
      include: {
        exercises: true,
        sets: true,
      },
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

    return workout
  }
  catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Ошибка при получении тренировки',
    })
  }
})

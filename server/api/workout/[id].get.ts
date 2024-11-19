import { getServerSession } from '#auth'
import type { CreateWorkoutResponse } from '~/ts/interfaces'

export default defineEventHandler(async (event): Promise<CreateWorkoutResponse> => {
  const session = await getServerSession(event)

  if (!session) {
    throw createError({
      statusCode: 401,
      message: 'Необходима авторизация',
    })
  }

  try {
    const id = event.context.params?.id

    if (!id) {
      throw createError({
        statusCode: 400,
        message: 'ID тренировки обязателен',
      })
    }

    const workout = await event.context.prisma.workout.findUnique({
      where: {
        id,
        userId: session.user.id,
      },
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

    return workout
  }
  catch (error) {
    console.error('Ошибка при получении тренировки:', error)

    throw createError({
      statusCode: 500,
      message: 'Ошибка при получении тренировки',
    })
  }
})

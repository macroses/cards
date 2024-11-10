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
    const { id } = await readBody(event)

    if (!id) {
      throw createError({
        statusCode: 400,
        message: 'ID тренировки обязателен',
      })
    }

    await event.context.prisma.workout.delete({
      where: {
        id,
        userId: session.user.id,
      },
    })

    return { success: true }
  }
  catch (error) {
    console.error('Ошибка при удалении тренировки:', error)

    throw createError({
      statusCode: 500,
      message: 'Ошибка при удалении тренировки',
    })
  }
})
